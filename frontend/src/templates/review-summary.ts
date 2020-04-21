import templateDate from './date';

interface Review {
  author: string;
  publicationDate: Date;
  summary: string;
  url: string;
}

export default (review: Review): string => (
  `<h3>
    Reviewed by ${review.author}
    on ${templateDate(review.publicationDate)}
  </h3>
  <p>${review.summary}</p>
  <a href="${review.url}">
    Read the full review
  </a>`
);
