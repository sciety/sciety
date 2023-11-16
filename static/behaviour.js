(function(doc) {
  // for activity page
  function buildToggle() {
    const button = doc.createElement('button');
    button.classList.add('activity-feed__item__toggle');
    return button;
  }
  const itemBodies = doc.querySelectorAll('[data-behaviour="collapse_to_teaser"]');
  Array.prototype.forEach.call(itemBodies, function (itemBody) {
    const teaser = itemBody.querySelector('[data-teaser]');
    const fullText = itemBody.querySelector('[data-full-text]');

    const more = buildToggle();
    more.innerHTML = 'More';
    more.setAttribute('aria-label', 'Read more of this content');
    if(teaser.lastElementChild?.nodeName === 'P') {
      teaser.lastElementChild.appendChild(doc.createTextNode(' '));
      teaser.lastElementChild.appendChild(more);
    } else {
      teaser.appendChild(more);
    }

    const less = buildToggle();
    less.innerHTML = 'Less';
    less.setAttribute('aria-hidden', 'true');
    fullText.insertBefore(less, fullText.querySelector('[data-read-original-source]'));

    teaser.classList.remove('hidden');
    fullText.classList.add('hidden');

    more.addEventListener('click', function (e) {
      teaser.classList.add('hidden');
      fullText.classList.remove('hidden');
    });

    less.addEventListener('click', function (e) {
      teaser.classList.remove('hidden');
      fullText.classList.add('hidden');
    });
  });

  // for search results page
  const clearSearchText = doc.getElementById('clearSearchText');
  if (clearSearchText) {
    const searchInput = doc.getElementById('searchText');
    if (searchInput.value.length) {
      clearSearchText.classList.remove('visually-hidden');
    }
    clearSearchText.setAttribute('aria-label', 'Clear search text');
    searchInput.addEventListener('input', function(e) {
      if (e.target.value.length > 0) {
        clearSearchText.classList.remove('visually-hidden');
      } else {
        clearSearchText.classList.add('visually-hidden');
      }
    })
  }
}(window.document));
