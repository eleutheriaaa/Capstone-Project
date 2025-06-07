export default class ResultsPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showResults() {
    this.#view.showLoading();
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const results = {
        diagnosis: decodeURIComponent(urlParams.get('diagnosis')),
        confidence: urlParams.get('confidence'),
        description: decodeURIComponent(urlParams.get('description')),
        treatment: decodeURIComponent(urlParams.get('treatment'))
      };
      
      this.#view.showResults(results);
    } catch (error) {
      console.error('showResults: error:', error);
      this.#view.showError('Failed to load results');
    } finally {
      this.#view.hideLoading();
    }
  }
}