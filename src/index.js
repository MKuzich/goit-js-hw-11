import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { fetchImages, resetCounters, increaseCounters, page, summaryHits } from './js/fetchImages';
import { createImagesListMarkup } from './js/createImagesListMarkup';
import { makeSmoothScroll, deleteSmoothScroll } from './js/pageScrolling';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const inputField = document.querySelector('input');
const DELAY = 500;
const debounceOptions = {leading: true, trailing: false};

let name = '';
let simpleGallery = null;

createSimpleGallery();

const loadMoreOnScroll = async () => {
  let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
  let clientScreenHeight = document.documentElement.clientHeight + 100;
  if (windowRelativeBottom < clientScreenHeight && summaryHits < 500) {
    if (inputField.value.trim() !== name) {
      return;
    }
    const response = await fetchImages(name);
    try {
      drawImages(response.hits);
      preventDefaultOnLinks();
      refreshSimpleGallery();
      increaseCounters();
      makeSmoothScroll();
    } catch (error) {
      console.log(error);
    };
  } else if (summaryHits > 500) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
  }
};

window.addEventListener('scroll', throttle(loadMoreOnScroll, DELAY));

const onFormSubmit = async (event) => {
  event.preventDefault();
  requestChange();

  if (summaryHits > 500) {
    return Notify.warning("We're sorry, but you've reached the end of search results.");
  };

  if (name === "") {
    return Notify.warning("We're sorry, but you've must write something in input field.");
  };

  const response = await fetchImages(name);
  try {
    if (response.hits.length === 0) {
      throw new Error('Sorry, there are no images matching your search query. Please try again.');
    } else {
      if (page === 1) {
        Notify.success(`Hooray! We found ${response.totalHits} images.`);
      };
        drawImages(response.hits);
    };
        preventDefaultOnLinks();
        refreshSimpleGallery();
        increaseCounters();
        makeSmoothScroll();
  } catch (error) {
    return Notify.failure(error.message);
  };
};

form.addEventListener('submit', throttle(onFormSubmit, DELAY));

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

function onFormInput() {
  deleteSmoothScroll();
  gallery.innerHTML = "";
  resetCounters();
};

inputField.addEventListener('input', debounce(onFormInput, DELAY, debounceOptions));

function requestChange() {
  name = form.elements.searchQuery.value.trim();
};


function drawImages(imagesArray) {
  return gallery.insertAdjacentHTML('beforeend', createImagesListMarkup(imagesArray));
};


