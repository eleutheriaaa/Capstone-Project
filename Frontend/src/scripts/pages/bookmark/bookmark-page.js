import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates.js';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';

export default class BookmarkPage {
  #presenter = null;
  #map = null;
  #markers = []; // Track markers for cleanup

  async render() {
    return `
    <section>
      <div class="stories-list__map__container">
        <div id="map" class="stories-list__map"></div>
        <div id="map-loading-container"></div>
      </div>
    </section>

    <section id="stories-section" class="container" tabindex="-1">
      <h1 class="section-title">Bookmarked Stories</h1>
      <div class="stories-list__container">
        <div id="stories-list"></div>
        <div id="stories-list-loading-container"></div>
      </div>
    </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  populateStoriesList(message, stories) {
    const listStory = stories || [];

    if (listStory.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = listStory.reduce((accumulator, story) => {
      if (this.#map && story.lat != null && story.lon != null) {
        this.#addMarker(story);
      }
      return accumulator.concat(generateStoryItemTemplate(story));
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  #addMarker(story) {
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker = L.marker([story.lat, story.lon], {
      icon: customIcon,
      alt: story.title,
    }).addTo(this.#map).bindPopup(`
        <b>${story.name}</b><br>
        ${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}
        <br><a href="#/stories/${story.id}">Lihat detail</a>
      `);

    this.#markers.push(marker);
  }

  async initialMap() {
    this.#map = L.map('map').setView([-2.5489, 118.0149], 5); // Default Indonesia view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    if (this.#markers.length > 0) {
      const markerGroup = new L.featureGroup(this.#markers);
      this.#map.fitBounds(markerGroup.getBounds().pad(0.2));
    }
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
