import { BASE_URL } from '../../config';

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
      const hash = window.location.hash;
      const queryString = hash.includes('?') ? hash.split('?')[1] : '';
      const urlParams = new URLSearchParams(queryString);

      const id = urlParams.get('id');
      if (!id) {
        throw new Error('No result ID provided');
      }

      const detailResult = await this.#model.getUploadDetail(id);
      console.log('detailResult.data.imageUrl:', detailResult.data.imageUrl);
      if (!detailResult.ok) {
        throw new Error(detailResult.message || 'Failed to get result detail');
      }

      const results = {
        predictedClass: urlParams.get('predictedClass') 
          ? decodeURIComponent(urlParams.get('predictedClass')) 
          : 'Unknown',
        confidence: urlParams.get('confidence') || 'N/A',
        imageUrl: detailResult.data.imageUrl || 'images/placeholder-result.jpg',
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
