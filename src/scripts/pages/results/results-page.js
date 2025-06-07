import {
  generateLoaderAbsoluteTemplate,
} from '../../templates';
import ResultsPresenter from './results-presenter';
import * as StoryAPI from '../../data/api';

export default class ResultsPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="results-header">
          <h1 class="section-title">Analysis Results</h1>
          <p class="section-subtitle">Your skin condition analysis</p>
        </div>

        <div class="results-container">
          <div id="results-content" class="results-content">
            <!-- Results will be loaded here -->
          </div>
          <div id="results-loading-container"></div>
        </div>

        <div class="results-actions">
          <a href="#/" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Back to Home
          </a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new ResultsPresenter({
      view: this,
      model: StoryAPI,
    });
    await this.#presenter.showResults();
  }

  showResults(results) {
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
      <div class="result-card">
        <div class="result-image">
          <img src="images/placeholder-result.jpg" alt="Analyzed skin condition">
        </div>
        <div class="result-details">
          <h3>Diagnosis: <span class="diagnosis">${results.diagnosis}</span></h3>
          <p class="confidence">Confidence: ${results.confidence}%</p>
          <div class="result-description">
            <h4>Description:</h4>
            <p>${results.description}</p>
          </div>
          <div class="result-treatment">
            <h4>Recommended Treatment:</h4>
            <p>${results.treatment}</p>
          </div>
        </div>
      </div>
    `;
  }

  showError(message) {
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Failed to load results</h3>
        <p>${message || 'An error occurred while loading results. Please try again.'}</p>
      </div>
    `;
  }

  showLoading() {
    document.getElementById('results-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('results-loading-container').innerHTML = '';
  }
}