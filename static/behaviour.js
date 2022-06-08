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
    const elementBeforeReadSource = fullText.querySelector('.activity-feed__item__read_original_source')?.previousElementSibling;
    if(elementBeforeReadSource?.nodeName === 'P') {
      elementBeforeReadSource.appendChild(doc.createTextNode(' '));
      elementBeforeReadSource.appendChild(less);
    } else {
      fullText.insertBefore(less, fullText.querySelector('.activity-feed__item__read_original_source'));
    }

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
    clearSearchText.addEventListener('click', function (e) {
      searchInput.setAttribute('value', '');
      clearSearchText.classList.add('visually-hidden');
      searchInput.focus();
    });
  }

  // for groups page filter
  const groupFilter = doc.getElementById('groupFilter');
  if (groupFilter) {
    groupFilter.addEventListener('input', function(e) {
      if (e.target.value.length > 2) {
        console.log('groupFilter: ', e.target.value);
        const groups = Array.from(doc.getElementById('groupList').children);
        groups.forEach(function(item) {
          console.log(item)
        })
        groups[1].classList.add('hidden');
        groups[3].classList.add('hidden');
        groups[4].classList.add('hidden');

        const groupListStatus = doc.getElementById('groupListStatus');
        groupListStatus.innerHTML = `Showing ${e.target.value.length} of 20<span class="visually-hidden"> groups</span>`;
      } else {
        if (groupListStatus.innerHTML !== 'Showing all groups') {
          groupListStatus.innerHTML = `Showing all groups`;
        }
      }
    });
  }
}(window.document));
