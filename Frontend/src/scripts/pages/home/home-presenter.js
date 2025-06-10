export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async uploadImage(imageBlob) {
    const response = await this.#model.uploadImage(imageBlob);
    if (!response.ok) {
      this.#view.showAnalysisError(response.message);
      return null;
    }
    return response.data;
  }

  async analyzeImage(imageBlob) {
    const response = await this.#model.analyzeImage(imageBlob);
    if (!response.ok) {
      this.#view.showAnalysisError(response.message);
      return null;
    }
    return response;
  }

  async processImage(imageBlob) {
    this.#view.showSubmitLoadingButton();

    try {
      const uploadData = await this.uploadImage(imageBlob);
      if (!uploadData) return;

      const analysis = await this.analyzeImage(imageBlob);
      if (!analysis) return;

      // Navigasi ke halaman hasil dengan id dan data analisis
      window.location.hash = `/results?id=${uploadData.id}&predictedClass=${encodeURIComponent(analysis.predictedClass)}&confidence=${analysis.confidence}`;
    } catch (error) {
      console.error('processImage: error:', error);
      this.#view.showAnalysisError(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
