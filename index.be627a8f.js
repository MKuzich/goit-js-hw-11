function e(t){const o=`https://pixabay.com/api/?key=27957885-8dff7fee3c243073fce7c6825&q=${t}&image_type=photo&orientation=horizontal&safesearch=true`;console.log(o),e(o)}document.querySelector("#search-form").addEventListener("submit",(function(t){t.preventDefault();const o=t.currentTarget.elements.searchQuery.value.trim();console.log(o),e(o)}));
//# sourceMappingURL=index.be627a8f.js.map
