(function(doc) {
  function buildToggle() {
    const button = doc.createElement('button');
    button.classList.add('activity-feed__item-toggle');
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
      teaser.lastElementChild.appendChild(more);
    } else {
      teaser.appendChild(more);
    }

    const less = buildToggle();
    less.innerHTML = 'Less';
    less.setAttribute('aria-hidden', 'true');
    const elementBeforeReadSource = fullText.querySelector('.activity-feed__item__read_more')?.previousElementSibling;
    if(elementBeforeReadSource?.nodeName === 'P') {
      elementBeforeReadSource.appendChild(doc.createTextNode(' '));
      elementBeforeReadSource.appendChild(less);
    } else {
      fullText.insertBefore(less, fullText.querySelector('.activity-feed__item__read_more'));
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
}(window.document));
