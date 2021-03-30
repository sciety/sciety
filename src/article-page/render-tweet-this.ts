import { flow } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';

const constructLink = (doi: Doi) => `
  https://sciety.org/articles/${doi.value}?utm_source=twitter&utm_medium=social&utm_campaign=tweet_button
`.trim();

const constructTweetText = (link: string) => `
  Check out this great article I found on @ScietyHQ, where groups of trusted experts evaluate and curate the latest research: ${link}
`.trim();

const constructAnchor = (encodedTweetText: string) => `
  <a class="tweet-button" target="_blank" href="https://twitter.com/intent/tweet?text=${encodedTweetText}">
    <img class="tweet-button__icon" src="/static/images/twitter-logo.svg" alt=""> Tweet this
  </a>
`;

export const renderTweetThis = flow(
  constructLink,
  constructTweetText,
  encodeURIComponent,
  constructAnchor,
  toHtmlFragment,
);
