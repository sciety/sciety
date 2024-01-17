const convertMarkdownToHtml = (md) =>
  new remarkable.Remarkable({ html: true }).render(md);

(function (doc) {
  const markdown = doc.querySelector("#markdown");
  const rendered = doc.querySelector("#rendered");

  rendered.innerHTML = convertMarkdownToHtml(markdown.value);

  markdown.addEventListener("keyup", () => {
    rendered.innerHTML = convertMarkdownToHtml(markdown.value);
  });
})(window.document);
