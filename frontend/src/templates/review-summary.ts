import templateDate from './date';

interface Review {
  author: string;
  publicationDate: Date;
  summary: string;
  url: string;
}

export default (review: Review, idNamespace: string): string => (
  `<h3>
    Reviewed by <span id="${idNamespace}-author">${review.author}</span>
    on ${templateDate(review.publicationDate)}
  </h3>
  <p>${review.summary}</p>
  <a href="${review.url}" id="${idNamespace}-read-more"
    aria-labelledby="${idNamespace}-read-more ${idNamespace}-author">
    Read the full review
  </a>`
);
