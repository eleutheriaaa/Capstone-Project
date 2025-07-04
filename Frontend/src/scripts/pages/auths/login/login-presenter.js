export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });
      console.log('Login response:', response);

      if (!response.ok) {
        console.error('getLogin: response:', response);
        this.#view.loginFailed(response.message);
        return;
      }

      // this.#authModel.putAccessToken(response.data.accessToken);
      this.#authModel.putAccessToken(response.data.token);

      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('getLogin: error:', error);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
