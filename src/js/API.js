import axios from 'axios';
export default class PicsApi {
  constructor() {
    this.topic = '';
    this.page = 1;
  }

  async fetchPics() {
    const URL = 'https://pixabay.com/api/';
    const KEY = '35668157-dc7e121b764e10d5e5d6ef031';

    const response = await axios.get(`${URL}`, {
      params: {
        q: this.topic,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        key: KEY,
      },
    });
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }
}
