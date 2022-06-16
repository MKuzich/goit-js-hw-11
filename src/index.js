import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', onFormSubmit);
form.addEventListener('change', onFormChange);

function onFormSubmit(event) {
    event.preventDefault();
    const name = event.currentTarget.elements.searchQuery.value.trim();

    fetchImages(name);
}

function onFormChange() {
    page = 1;
    gallery.innerHTML = "";
}

function fetchImages(request) {
    const API_KEY = '27957885-8dff7fee3c243073fce7c6825';
    const IMAGE_TYPE = 'photo';
    const ORIENTATION = 'horizontal';
    const SAFE_SEARCH = true;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${request}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&per_page=40&page=${page}`;

    return fetch(url)
        .then(r => r.json())
        .then(r => createImagesListMarkup(r.hits))
        .then(r => gallery.insertAdjacentHTML('beforeend', r))
        .then(() => {const links = gallery.querySelectorAll('.gallery__item');
        links.forEach(el => el.addEventListener('click', e => e.preventDefault()));
        let lightbox = new SimpleLightbox('.photo-card a', {captionDelay: "250"});})
        .then(page += 1)
        .catch(console.log);
}

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

//   &hits=webformatURL,largeImageURL,tags,likes,views,comments,downloads