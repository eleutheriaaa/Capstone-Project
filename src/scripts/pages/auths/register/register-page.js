import RegisterPresenter from './register-presenter';
import * as StoryAPI from '../../../data/api';

export default class RegisterPage {
  #presenter = null;
  hideHeader = true;

  async render() {
    return `
      <section class="register-page">
        <div class="register-container">
          <div class="register-card">
            <div class="register-header">
              <h1 class="register-title">Create Account</h1>
              <p class="register-subtitle">Join our community today</p>
            </div>

            <form id="register-form" class="register-form">
              <div class="form-group">
                <label for="name-input" class="form-label">Full Name</label>
                <div class="input-with-icon">
                  <i class="fas fa-user input-icon"></i>
                  <input 
                    id="name-input" 
                    type="text" 
                    name="name" 
                    class="form-input"
                    placeholder="John Doe"
                    required
                  >
                </div>
              </div>

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
                <p class="password-hint">Minimum 6 characters</p>
              </div>

              <div class="form-group">
                <label for="confirm-password-input" class="form-label">Confirm Password</label>
                <div class="input-with-icon">
                  <i class="fas fa-lock input-icon"></i>
                  <input 
                    id="confirm-password-input" 
                    type="password" 
                    name="confirmPassword" 
                    class="form-input"
                    placeholder="••••••••"
                    required
                    minlength="6"
                  >
                </div>
              </div>

              <div id="submit-button-container" class="submit-container">
                <button type="submit" class="register-button">Create Account</button>
              </div>

              <div class="register-footer">
                <p>Already have an account? <a href="#/login" class="login-link">Sign in</a></p>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
    this.#setupPasswordValidation();
  }

  #setupForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const password = document.getElementById('password-input').value;
      const confirmPassword = document.getElementById('confirm-password-input').value;

      if (password !== confirmPassword) {
        this.registeredFailed("Passwords don't match");
        return;
      }

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: password,
      };
      await this.#presenter.getRegistered(data);
    });
  }

  #setupPasswordValidation() {
    const passwordInput = document.getElementById('password-input');
    const confirmInput = document.getElementById('confirm-password-input');

    if (passwordInput && confirmInput) {
      confirmInput.addEventListener('input', () => {
        if (passwordInput.value !== confirmInput.value) {
          confirmInput.setCustomValidity("Passwords don't match");
        } else {
          confirmInput.setCustomValidity('');
        }
      });
    }
  }

  registeredSuccessfully(message) {
    console.log(message);
    location.hash = '/login';
  }

  registeredFailed(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'register-error';
    errorElement.textContent = message;
    
    const form = document.getElementById('register-form');
    const submitButton = document.getElementById('submit-button-container');
    
    if (form && submitButton) {
      if (form.querySelector('.register-error')) {
        form.removeChild(form.querySelector('.register-error'));
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
        <button type="submit" class="register-button" disabled>
          <i class="fas fa-spinner fa-spin"></i> Creating Account...
        </button>
      `;
    }
  }

  hideSubmitLoadingButton() {
    const container = document.getElementById('submit-button-container');
    if (container) {
      container.innerHTML = `
        <button type="submit" class="register-button">Create Account</button>
      `;
    }
  }
}