import LoginPresenter from './login-presenter';
import * as StoryAPI from '../../../data/api';
import * as AuthModel from '../../../utils/auth';

export default class LoginPage {
  #presenter = null;
  hideHeader = true;

  async render() {
    return `
      <section class="login-page">
        <div class="login-container">
          <div class="login-card">
            <div class="login-header">
              <h1 class="login-title">Welcome</h1>
              <p class="login-subtitle">Please enter your credentials to login</p>
            </div>

            <form id="login-form" class="login-form">
              <div class="form-group">
                <label for="email-input" class="form-label">Email Address</label>
                <div class="input-with-icon">
                  <i class="fas fa-envelope input-icon"></i>
                  <input 
                    id="email-input" 
                    type="email" 
                    name="email" 
                    class="form-input"
                    placeholder="your@email.com"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="password-input" class="form-label">Password</label>
                <div class="input-with-icon">
                  <i class="fas fa-lock input-icon"></i>
                  <input 
                    id="password-input" 
                    type="password" 
                    name="password" 
                    class="form-input"
                    placeholder="••••••••"
                    required
                    minlength="6"
                  >
                </div>
              </div>
              
              <div id="submit-button-container" class="submit-container">
                <button type="submit" class="login-button">Sign In</button>
              </div>

              <div class="login-footer">
                <p>Don't have an account? <a href="#/register" class="register-link">Sign up</a></p>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  loginSuccessfully(message) {
    console.log(message);
    location.hash = '/';
  }

  loginFailed(message) {
    // Show error message in a more user-friendly way
    const errorElement = document.createElement('div');
    errorElement.className = 'login-error';
    errorElement.textContent = message;
    
    const form = document.getElementById('login-form');
    const submitButton = document.getElementById('submit-button-container');
    
    if (form && submitButton) {
      if (form.querySelector('.login-error')) {
        form.removeChild(form.querySelector('.login-error'));
      }
      form.insertBefore(errorElement, submitButton);
    } else {
      alert(message);
    }
  }

  showSubmitLoadingButton() {
    const container = document.getElementById('submit-button-container');
    if (container) {
      container.innerHTML = `
        <button type="submit" class="login-button" disabled>
          <i class="fas fa-spinner fa-spin"></i> Signing In...
        </button>
      `;
    }
  }

  hideSubmitLoadingButton() {
    const container = document.getElementById('submit-button-container');
    if (container) {
      container.innerHTML = `
        <button type="submit" class="login-button">Sign In</button>
      `;
    }
  }
}