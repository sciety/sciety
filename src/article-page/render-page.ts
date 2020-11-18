import striptags from 'striptags';
import { Maybe, Result } from 'true-myth';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

type Page = {
  content: HtmlFragment,
  openGraph: {
    title: string,
    description: string,
  }
};

type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: HtmlFragment,
};

type ArticleDetails = {
  title: string,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
};

export type GetArticleDetails = (doi: Doi) => Promise<Result<ArticleDetails, 'not-found'|'unavailable'>>;

type Component = (doi: Doi, userId: Maybe<UserId>) => Promise<Result<string, 'not-found' | 'unavailable'>>;
type RenderFeed = (doi: Doi, userId: Maybe<UserId>) => Promise<Result<string, 'no-content'>>;
export type RenderPage = (doi: Doi, userId: Maybe<UserId>) => Promise<Result<Page, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderAbstract: Component,
  renderFeed: RenderFeed,
  getArticleDetails: GetArticleDetails,
): RenderPage => {
  const template = (abstract: string) => (pageHeader: string) => (feed: string) => (articleDetails: ArticleDetails) => (
    {
      content: toHtmlFragment(`
<article class="sciety-grid sciety-grid--article">
  ${pageHeader}

  <div class="main-content main-content--article">
    ${abstract}
    ${feed}
  </div>
</article>
    `),
      openGraph: {
        title: striptags(articleDetails.title),
        description: striptags(articleDetails.abstract),
      },
    }
  );

  return async (doi, userId) => {
    const abstractResult = renderAbstract(doi, userId);
    const pageHeaderResult = renderPageHeader(doi, userId);
    const feedResult = renderFeed(doi, userId)
      .then((feed) => (
        feed.or(Result.ok<string, never>(''))
      ));
    const articleDetailsResult = getArticleDetails(doi);
    return Result.ok<typeof template, 'not-found' | 'unavailable'>(template)
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
      .ap(await articleDetailsResult)
      .mapErr((error) => {
        switch (error) {
          // TODO: remove duplication between these cases and the sciety-grid case
          // which is coupled to them
          case 'not-found':
            return {
              type: 'not-found',
              content: toHtmlFragment(`
                <div class="sciety-grid sciety-grid--simple">
                  <h1>Oops!</h1>
                  <p>
                    We’re having trouble finding this information.
                    Ensure you have the correct URL, or try refreshing the page.
                    You may need to come back later.
                  </p>
                  <p>
                    <a href="/" class="u-call-to-action-link">Return to Homepage</a>
                  </p>
                </div>
              `),
            };
          case 'unavailable':
            return {
              type: 'unavailable',
              content: toHtmlFragment(`
                <div class="sciety-grid sciety-grid--simple">
                  <h1>Oops!</h1>
                  <p>
                    We’re having trouble finding this information.
                    Ensure you have the correct URL, or try refreshing the page.
                    You may need to come back later.
                  </p>
                  <p>
                    <a href="/" class="u-call-to-action-link">Return to Homepage</a>
                  </p>
                </div>
              `),
            };
        }
      });
  };
};
