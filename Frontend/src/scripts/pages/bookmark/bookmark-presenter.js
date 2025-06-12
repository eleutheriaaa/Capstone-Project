export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      // Get stories directly from IndexedDB
      const stories = await this.#model.getAllStories();

      // Database returns array directly, no need for ok/response wrapper
      if (!stories || stories.length === 0) {
        this.#view.populateStoriesListEmpty();
        return;
      }

      // Format the response to match what the view expects
      const response = {
        message: 'Bookmarked stories loaded successfully',
        listStory: stories,
      };

      this.#view.populateStoriesList(response.message, response.listStory);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
