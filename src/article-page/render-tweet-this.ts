import { flow } from 'fp-ts/lib/function';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const constructLink = (doi: Doi): string => `
  https://sciety.org/articles/${doi.value}?utm_source=twitter&utm_medium=social&utm_campaign=tweet_button
`;

const constructTweetText = (link: string): string => `
  Check out this great article I found on @ScietyHQ, where the community can evaluate and curate the latest research: ${link}
`;

const constructAnchor = (encodedTweetText: string): string => `
  <a class="tweet-button" target="_blank" href="https://twitter.com/intent/tweet?text=${encodedTweetText}">
    <img class="tweet-button__icon" src="/static/images/twitter-logo.svg" alt=""> Tweet this
  </a>
`;

type RenderTweetThis = (doi: Doi) => HtmlFragment;

export const renderTweetThis: RenderTweetThis = flow(
  constructLink,
  constructTweetText,
  encodeURIComponent,
  constructAnchor,
  toHtmlFragment,
);
