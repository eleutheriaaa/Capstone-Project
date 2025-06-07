export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async analyzeImage(data) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.analyzeImage(data);

      if (!response.ok) {
        console.error('analyzeImage: response:', response);
        this.#view.showAnalysisError(response.message);
        return;
      }

      // Navigate to results page with analysis data
      window.location.hash = `/results?diagnosis=${encodeURIComponent(response.diagnosis)}&confidence=${response.confidence}&description=${encodeURIComponent(response.description)}&treatment=${encodeURIComponent(response.treatment)}`;
    } catch (error) {
      console.error('analyzeImage: error:', error);
      this.#view.showAnalysisError(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}