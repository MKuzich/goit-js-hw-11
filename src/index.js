import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import axios from 'axios';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const inputField = document.querySelector('input');
const clientScreenHeight = document.documentElement.clientHeight + 200;
const DELAY = 250;
const debounceOptions = {leading: true, trailing: false};

let page = 1;
let summaryHits = 0;
let name = '';
let simpleGallery = null;

createSimpleGallery();

form.addEventListener('submit', throttle(onFormSubmit, DELAY));
inputField.addEventListener('input', debounce(onFormInput, DELAY, debounceOptions));
window.addEventListener('scroll', throttle(loadMoreOnScroll, DELAY));

function loadMoreOnScroll() {
  if (document.documentElement.getBoundingClientRect().bottom < clientScreenHeight && summaryHits < 500) {
    fetchImages(name)
    .then((r) => drawImages(r.hits))
    .then(() => {
      preventDefaultOnLinks();
      refreshSimpleGallery();
      increaseCounters();
      makeSmoothScroll();
    })
    .catch(() => Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
  }
};

function onFormSubmit(event) {
  event.preventDefault();
  requestChange(event);

  if (summaryHits > 500) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
    return;
  };

  if (name === "") {
    return;
  };

  fetchImages(name)
    .then(r => {
      if (r.hits.length === 0) {
        throw new Error('Sorry, there are no images matching your search query. Please try again.');
      } else {
        if (page === 1) {
          Notify.success(`Hooray! We found ${r.totalHits} images.`);
        };
          drawImages(r.hits);
      }
    })
    .then(() => {
      preventDefaultOnLinks();
      refreshSimpleGallery();
      increaseCounters();
      makeSmoothScroll();
    })
    .catch(error => Notify.failure(error));
};

function preventDefaultOnLinks() {
  const links = gallery.querySelectorAll('.gallery__item');
  links.forEach(el => el.addEventListener('click', e => e.preventDefault()));
};

function createSimpleGallery() {
  return simpleGallery = new SimpleLightbox('.photo-card a');
};

function refreshSimpleGallery() {
  simpleGallery.refresh();
};

function increaseCounters() {
  summaryHits = page * 40;
  page += 1;
};

function resetCounters() {
  page = 1;
  summaryHits = 0;
};

function makeSmoothScroll() {
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
};

function onFormInput() {
  gallery.innerHTML = "";
  resetCounters();
  onInputChange(event);
};

function onInputChange(event) {
  name = event.currentTarget.value.trim();
}

function requestChange(event) {
  name = event.currentTarget.elements.searchQuery.value.trim();
};

function fetchImages(request) {
  const searchParams = new URLSearchParams({
    key: '27957885-8dff7fee3c243073fce7c6825',
    q: request,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });

  const url = `https://pixabay.com/api/?${searchParams}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
};

function drawImages(imagesArray) {
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
};


