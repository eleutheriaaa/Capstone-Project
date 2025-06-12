import {
  generateLoaderAbsoluteTemplate,
} from '../../templates.js';
import HomePresenter from './home-presenter';
import * as StoryAPI from '../../data/api';
import { convertBase64ToBlob } from '../../utils';
import Camera from '../../utils/camera';

export default class HomePage {
  #presenter = null;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentations = [];

  async render() {
    return `
      <section class="container">
        <div class="classification-header">
          <h1 class="section-title">Skin Disease Classification</h1>
          <p class="section-subtitle">Upload an image of your skin condition for analysis</p>
        </div>

        <div class="classification-form-container">
          <form id="classification-form" class="classification-form">
            <div class="form-control">
              <label for="image-input" class="form-label">Upload Image</label>
              <div id="image-more-info" class="form-hint">Please upload a clear photo of the affected area.</div>

              <div class="image-upload-container">
                <div class="image-upload-buttons">
                  <button id="image-input-button" class="btn btn-primary" type="button">
                    <i class="fas fa-upload"></i> Select Image
                  </button>
                  <input
                    id="image-input"
                    class="image-upload-input"
                    name="image"
                    type="file"
                    accept="image/*"
                    aria-describedby="image-more-info"
                  >
                  <button id="open-camera-button" class="btn btn-secondary" type="button">
                    <i class="fas fa-camera"></i> Use Camera
                  </button>
                </div>

                <div id="camera-container" class="camera-container">
                  <video id="camera-video" class="camera-video">
                    Video stream not available.
                  </video>
                  <canvas id="camera-canvas" class="camera-canvas"></canvas>

                  <div class="camera-tools">
                    <select id="camera-select" class="camera-select"></select>
                    <div class="camera-tools-buttons">
                      <button id="camera-take-button" class="btn btn-primary" type="button">
                        <i class="fas fa-camera"></i> Capture
                      </button>
                    </div>
                  </div>
                </div>

                <div id="image-preview-container" class="image-preview-container">
                  ${this.#takenDocumentations.length === 0 ? 
                    '<div class="empty-state">No image selected</div>' : 
                    ''}
                </div>
              </div>
            </div>

            <div class="form-actions">
              <div id="submit-button-container">
                <button class="btn btn-submit" type="submit">
                  <i class="fas fa-search"></i> Analyze Image
                </button>
              </div>
              <button id="clear-button" class="btn btn-outline" type="button">
                <i class="fas fa-trash"></i> Clear
              </button>
            </div>
          </form>
        </div>

        <div id="results-section" class="results-container" style="display: none;">
          <h2 class="results-title">Analysis Results</h2>
          <div id="results-content" class="results-content">
            <!-- Results will be displayed here -->
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });
    this.#takenDocumentations = [];

    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('classification-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (this.#takenDocumentations.length === 0) {
        alert('Please upload an image first');
        return;
      }

    // Upload image ke backend
    const uploadResult = await this.#presenter.uploadImage(this.#takenDocumentations[0].blob);

    if (!uploadResult) {
      // Kalau gagal upload, hentikan proses
      return;
    }

      await this.#presenter.processImage(this.#takenDocumentations[0].blob);
    });

    document.getElementById('image-input').addEventListener('change', async (event) => {
      if (event.target.files.length > 0) {
        await this.#addTakenPicture(event.target.files[0]);
        await this.#populateImagePreview();
      }
    });

    document.getElementById('image-input-button').addEventListener('click', () => {
      this.#form.elements.namedItem('image-input').click();
    });

    document.getElementById('clear-button').addEventListener('click', () => {
      this.#takenDocumentations = [];
      this.#populateImagePreview();
      document.getElementById('results-section').style.display = 'none';
    });

    const cameraContainer = document.getElementById('camera-container');
    document.getElementById('open-camera-button').addEventListener('click', async (event) => {
      cameraContainer.classList.toggle('open');

      this.#isCameraOpen = cameraContainer.classList.contains('open');
      if (this.#isCameraOpen) {
        event.currentTarget.innerHTML = '<i class="fas fa-times"></i> Close Camera';
        this.#setupCamera();
        this.#camera.launch();
        return;
      }

      event.currentTarget.innerHTML = '<i class="fas fa-camera"></i> Use Camera';
      this.#camera.stop();
    });
  }

  #setupCamera() {
    if (this.#camera) {
      return;
    }
    this.#camera = new Camera({
      video: document.getElementById('camera-video'),
      cameraSelect: document.getElementById('camera-select'),
      canvas: document.getElementById('camera-canvas'),
    });

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateImagePreview();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, 'image/png');
    }

    const newDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenDocumentations = [newDocumentation]; // Only keep one image at a time
  }

  async #populateImagePreview() {
    const previewContainer = document.getElementById('image-preview-container');
    
    if (this.#takenDocumentations.length === 0) {
      previewContainer.innerHTML = '<div class="empty-state">No image selected</div>';
      return;
    }

    const imageUrl = URL.createObjectURL(this.#takenDocumentations[0].blob);
    previewContainer.innerHTML = `
      <div class="image-preview">
        <img src="${imageUrl}" alt="Uploaded skin condition">
        <button type="button" class="remove-image-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    previewContainer.querySelector('.remove-image-btn').addEventListener('click', () => {
      this.#takenDocumentations = [];
      this.#populateImagePreview();
    });
  }

  showAnalysisResults(results) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
      <div class="result-card">
        <div class="result-image">
          <img src="${URL.createObjectURL(this.#takenDocumentations[0].blob)}" alt="Analyzed skin condition">
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
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  showAnalysisError(message) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Analysis Failed</h3>
        <p>${message || 'An error occurred during analysis. Please try again.'}</p>
      </div>
    `;
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn btn-submit" type="submit" disabled>
        <i class="fas fa-spinner fa-spin"></i> Analyzing...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn btn-submit" type="submit">
        <i class="fas fa-search"></i> Analyze Image
      </button>
    `;
  }

  showLoading() {
    document.getElementById('results-content').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    // Handled by showAnalysisResults or showAnalysisError
  }
  
}