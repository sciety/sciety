interface Review {
  summary: string,
  url: string,
};

export default (review: Review): string => (
  `<p>${review.summary}</p>
  <a href="${review.url}">
    Read the full review
  </a>
`
);
