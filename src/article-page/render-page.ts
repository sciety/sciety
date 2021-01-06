import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import striptags from 'striptags';
import { Result } from 'true-myth';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

export type Page = {
  title: string,
  content: HtmlFragment,
  openGraph: {
    title: string,
    description: string,
  }
};

type ArticleDetails = {
  title: string,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
};

export type GetArticleDetails = (doi: Doi) => T.Task<Result<ArticleDetails, 'not-found'|'unavailable'>>;

type Component = (doi: Doi) => T.Task<Result<string, 'not-found' | 'unavailable'>>;
type RenderFeed = (doi: Doi, userId: O.Option<UserId>) => Promise<Result<string, 'no-content'>>;
export type RenderPage = (doi: Doi, userId: O.Option<UserId>) => T.Task<Result<Page, RenderPageError>>;

const renderTweetThis = (doi: Doi): HtmlFragment => {
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

export default (
  renderPageHeader: Component,
  renderAbstract: Component,
  renderFeed: RenderFeed,
  getArticleDetails: GetArticleDetails,
): RenderPage => {
  const template = (
    abstract: string,
  ) => (pageHeader: string) => (feed: string) => (articleDetails: ArticleDetails) => (tweetThis: string) => (
    {
      title: `${striptags(articleDetails.title)}`,
      content: toHtmlFragment(`
<article class="sciety-grid sciety-grid--article">
  ${pageHeader}

  <div class="main-content main-content--article">
    ${abstract}
    ${feed}
  </div>

  ${tweetThis}
</article>
    `),
      openGraph: {
        title: striptags(articleDetails.title),
        description: striptags(articleDetails.abstract),
      },
    }
  );

  return (doi, userId) => async () => {
    const abstractResult = renderAbstract(doi)();
    const pageHeaderResult = renderPageHeader(doi)();
    const feedResult = renderFeed(doi, userId)
      .then((feed) => (
        feed.or(Result.ok<string, never>(''))
      ));
    const articleDetailsResult = getArticleDetails(doi);

    const tweetThisResult = Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(renderTweetThis(doi));

    return Result.ok<typeof template, 'not-found' | 'unavailable'>(template)
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
      .ap(await articleDetailsResult())
      .ap(tweetThisResult)
      .mapErr((error) => {
        switch (error) {
          case 'not-found':
            return {
              type: 'not-found',
              message: toHtmlFragment(`
                We’re having trouble finding this information.
                Ensure you have the correct URL, or try refreshing the page.
                You may need to come back later.
              `),
            };
          case 'unavailable':
            return {
              type: 'unavailable',
              message: toHtmlFragment(`
                We’re having trouble finding this information.
                Ensure you have the correct URL, or try refreshing the page.
                You may need to come back later.
              `),
            };
        }
      });
  };
};
