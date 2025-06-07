import { getActiveRoute } from '../routes/url-parser';
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from '../templates';
import {
  isServiceWorkerAvailable,
  setupSkipToContent,
  transitionHelper,
  registerServiceWorker,
} from '../utils';
import { getAccessToken, getLogout } from '../utils/auth';
import { routes } from '../routes/routes';

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;
  #headerElement;
  #serviceWorkerRegistered = false;

  constructor({ 
    content, 
    drawerNavigation, 
    drawerButton, 
    skipLinkButton,
    headerElement 
  }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;
    this.#headerElement = headerElement;

    this.#init();
  }

  async #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();

    if (isServiceWorkerAvailable()) {
      try {
        await registerServiceWorker();
        this.#serviceWorkerRegistered = true;
        console.log('Service worker registered successfully');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url] || routes['*'];
    const page = route();

    const hideHeader = page.hideHeader === true;

    const transition = transitionHelper({
      updateDOM: async () => {
        if (this.#headerElement) {
          this.#headerElement.style.display = hideHeader ? 'none' : 'block';
        }

        this.#content.innerHTML = await page.render();
        await page.afterRender();

        const storiesSection = document.getElementById('stories-section');
        if (storiesSection) {
          storiesSection.setAttribute('tabindex', '-1');
        }
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      if (!hideHeader) {
        this.#setupNavigationList();
      }

      setTimeout(() => {
        if (this.#serviceWorkerRegistered) {
        }
      }, 100);
    });
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#drawerNavigation.querySelector('#navlist-main');
    const navList = this.#drawerNavigation.querySelector('#navlist');

    if (!navListMain || !navList) {
      console.error('Navigation lists not found');
      return;
    }

    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
    } else {
      navListMain.innerHTML = generateMainNavigationListTemplate();
      navList.innerHTML = generateAuthenticatedNavigationListTemplate();

      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
          event.preventDefault();
          if (confirm('Apakah Anda yakin ingin keluar?')) {
            getLogout();
            location.hash = '/login';
          }
        });
      }
    }
  }
}