import PicsApi from './js/API';
import LoadMoreBtn from './js/load-more-btn';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const searchFromRef = document.querySelector('.search-form');
const galletyRef = document.querySelector('.gallery');
const btnLoadMoreRef = document.querySelector('.load-more');
const picsApi = new PicsApi();
const loadMorebtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });

searchFromRef.addEventListener('submit', onSearch);
btnLoadMoreRef.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  picsApi.topic = e.currentTarget.elements.searchQuery.value.trim();
  picsApi.resetPage();
  resetMarkup();

  if (picsApi.topic === '') {
    Notiflix.Notify.warning('Fill the search input');
    return;
  }

	loadMorebtn.show();
	loadMorebtn.disabled();
  picsApi.fetchPics().then(({ hits }) => {
    console.log(hits);
    console.log(hits.length);
    if (hits.length === 0) {
      Notiflix.Notify.warning(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
      return;
    }
	  rendermarkup(hits);
	  loadMorebtn.enable();
  });
}

function makeMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
	</a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
		${likes} 
    </p>
    <p class="info-item">
      <b>Views</b>
		${views} 
    </p>
    <p class="info-item">
      <b>Comments</b>
		${comments} 
    </p>
    <p class="info-item">
      <b>Downloads</b>
		${downloads} 
    </p>
  </div>
</div>`;
}

function rendermarkup(data) {
  const markup = data.reduce((html, topic) => html + makeMarkup(topic), '');
  galletyRef.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function resetMarkup() {
  galletyRef.innerHTML = '';
}

function onLoadMore() {
  picsApi.page += 1;
  picsApi.fetchPics().then(({ hits, totalHits }) => {
    console.log(picsApi.page);
    console.log(40 * picsApi.page);
    console.log(totalHits);
    if (100 * picsApi.page > totalHits) {
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    console.log(hits);
    rendermarkup(hits);
  });
}
