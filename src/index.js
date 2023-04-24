import PicsApi from './js/API';
import LoadMoreBtn from './js/load-more-btn';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFromRef = document.querySelector('.search-form');
const galletyRef = document.querySelector('.gallery');
const btnLoadMoreRef = document.querySelector('.load-more');
const picsApi = new PicsApi();
const loadMorebtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });

searchFromRef.addEventListener('submit', onSearch);
btnLoadMoreRef.addEventListener('click', onLoadMore);

async function onSearch(e) {
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

  try {
    const { totalHits, hits } = await picsApi.fetchPics();

    if (hits.length === 0) {
      loadMorebtn.hide();
      Notiflix.Notify.warning(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
      return;
    }

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
	  rendermarkup(hits);
	  autoScroll(0.35);
    loadMorebtn.enable();
  } catch (error) {
    Notiflix.Notify.failure('Oops something gone wrong..');
    console.log(error);
  }
}
async function onLoadMore() {
  picsApi.page += 1;
  loadMorebtn.disabled();
  try {
    const { totalHits, hits } = await picsApi.fetchPics();
    if (100 * picsApi.page > totalHits) {
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    loadMorebtn.enable();
    rendermarkup(hits);
    autoScroll(2);
  } catch (error) {
    Notiflix.Notify.failure('Oops something gone wrong..');
    console.log(error);
  }
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

function autoScroll(n) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * n,
    behavior: 'smooth',
  });
}
