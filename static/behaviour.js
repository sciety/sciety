(function(doc) {
  function buildToggle() {
    const button = doc.createElement('button');
    button.classList.add('article-feed__item-toggle');
    return button;
  }
  const itemBodies = doc.querySelectorAll('[data-behaviour="collapse_to_teaser"]');
  Array.prototype.forEach.call(itemBodies, function (itemBody) {
    const teaser = itemBody.querySelector('[data-teaser]');
    const fullText = itemBody.querySelector('[data-full-text]');

    const toggle = buildToggle();
    itemBody.insertBefore(toggle, fullText);

    teaser.classList.remove('hidden');
    fullText.classList.add('hidden');
    toggle.innerHTML = 'See more <span aria-hidden="true">+</span>';
    itemBody.dataset.collapsed = '';

    toggle.addEventListener('click', function (e) {
      const target = e.target;
      if (itemBody.dataset.collapsed !== undefined) {
        teaser.classList.add('hidden');
        fullText.classList.remove('hidden');
        target.innerHTML = 'See less <span aria-hidden="true">-</span>';
        delete itemBody.dataset.collapsed;
      } else {
        teaser.classList.remove('hidden');
        fullText.classList.add('hidden');
        target.innerHTML = 'See more <span aria-hidden="true">+</span>';
        itemBody.dataset.collapsed = '';
      }
    })
  });
}(window.document));
