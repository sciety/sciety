interface Review {
  author: string,
  summary: string,
  url: string,
};

export default (review: Review): string => (
  `<h3>
    Reviewed by ${review.author}
  </h3>
  <p>${review.summary}</p>
  <a href="${review.url}">
    Read the full review
  </a>`
);
