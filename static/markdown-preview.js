(function(doc) {
  const markdown = doc.querySelector('#markdown')
  const rendered = doc.querySelector('#rendered')

  markdown.addEventListener('keyup', () => {
    rendered.innerHTML = markdown.value
  })
}(window.document));
