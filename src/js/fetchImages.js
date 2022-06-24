import axios from 'axios';

export let page = 1;
export let summaryHits = 0;

export function increaseCounters() {
    summaryHits = page * 40;
    page += 1;
};

export function resetCounters() {
    page = 1;
    summaryHits = 0;
};

export function fetchImages(request) {
    const searchParams = new URLSearchParams({
        key: '27957885-8dff7fee3c243073fce7c6825',
        q: request,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page
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