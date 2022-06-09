const form = document.querySelector('#search-form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();

    const name = event.currentTarget.elements.searchQuery.value.trim();

    console.log(name);


    fetchImages(name)

}

// https://pixabay.com/api/?key=27957885-8dff7fee3c243073fce7c6825&q=yellow+flowers&image_type=photo

function fetchImages(request) {

    
    const API_KEY = '27957885-8dff7fee3c243073fce7c6825';
    const IMAGE_TYPE = 'photo';
    const ORIENTATION = 'horizontal';
    const SAFE_SEARCH = true;

    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${request}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}`;

    console.log(url)
    fetchImages(url)
}