import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let summaryHits = 0;
let name = '';

form.addEventListener('submit', onFormSubmit);
form.addEventListener('change', onFormChange);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick());

function onLoadMoreBtnClick() {
  console.log('before fetch load more');
  fetchImages(name)
    .then((r) => imagesDrawning(r.hits))
    .then(() => {
      preventDefaultOnLinks();
      createSimpleGallery();
      increaseCounters();
      makeSmoothScroll();
    })
    .catch(error => Notify.failure(error));
    console.log('after fetch load more');
};

function onFormSubmit(event) {
  event.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  requestChange(event);

  if (summaryHits > 500) {
    Notify.warning("We're sorry, but you've reached the end of search results.")
    loadMoreBtn.classList.add('is-hidden');
    return;
  }

  fetchImages(name)
    .then(r => {
      if (r.hits.length === 0) {
        throw new Error('Sorry, there are no images matching your search query. Please try again.');
      } else {
        if (page === 1) {
          Notify.success(`Hooray! We found ${r.totalHits} images.`);
        };
          imagesDrawning(r.hits);
      }
    })
    .then(() => {
      preventDefaultOnLinks();
      createSimpleGallery();
      loadMoreMakeVisible();
      increaseCounters();
      makeSmoothScroll();
    })
    .catch(error => Notify.failure(error));
}

function preventDefaultOnLinks() {
  const links = gallery.querySelectorAll('.gallery__item');
  links.forEach(el => el.addEventListener('click', e => e.preventDefault()));
};

function createSimpleGallery() {
  let lightbox = new SimpleLightbox('.photo-card a', {captionDelay: "250"});
};

function loadMoreMakeVisible() {
  loadMoreBtn.classList.remove('is-hidden');
};

function increaseCounters() {
  summaryHits = page * 40;
  page += 1;
};

function makeSmoothScroll() {
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function onFormChange() {
    page = 1;
    summaryHits = 0;
    gallery.innerHTML = "";
    requestChange(event);
}

function requestChange(event) {
  name = event.currentTarget.elements.searchQuery.value.trim();
}

function fetchImages(request) {
  const API_KEY = '27957885-8dff7fee3c243073fce7c6825';
  const IMAGE_TYPE = 'photo';
  const ORIENTATION = 'horizontal';
  const SAFE_SEARCH = true;
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${request}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&per_page=40&page=${page}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
};

function imagesDrawning(imagesArray) {
  return gallery.insertAdjacentHTML('beforeend', createImagesListMarkup(imagesArray))
};

function createImagesListMarkup(items) {
    return items.map(({likes, views, comments, downloads, tags, webformatURL, largeImageURL}) => {
        return `
  <div class="photo-card">
  <a href="${largeImageURL}" class="gallery__item">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>
  `})
  .join("")
  }


