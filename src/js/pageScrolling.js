
export function makeSmoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

export function deleteSmoothScroll() {
    const { height: galleryHeight } = document.querySelector(".gallery").getBoundingClientRect();

    window.scrollBy({
        top: -galleryHeight,
    });
};