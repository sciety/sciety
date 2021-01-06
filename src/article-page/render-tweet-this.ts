import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderTweetThis = (doi: Doi): HtmlFragment => {
  let tweetThis = '';
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    const tweetText = `Hello World @ScietyHQ https://sciety.org/articles/${doi.value}?utm_source=twitter&utm_medium=social&utm_campaign=tweet_button`;
    tweetThis = `
    <a target="_blank" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}">
      <img src="/static/images/twitter-logo.svg" alt=""> Tweet this
    </a>
  `;
  }
  return toHtmlFragment(tweetThis);
};
