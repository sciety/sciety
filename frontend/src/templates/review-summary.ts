interface Review {
  summary: string,
};

export default (review: Review): string => (
  `<p>${review.summary}</p>`
);
