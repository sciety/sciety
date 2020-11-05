import striptags from 'striptags';
import { Maybe, Result } from 'true-myth';
import Doi from '../types/doi';
import { UserId } from '../types/user-id';

type Page = {
  content: string,
  openGraph: {
    title: string,
    description: string,
  }
};

type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string,
};

type ArticleDetails = {
  title: string,
  abstract: string,
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
      content: `
<article class="hive-grid hive-grid--article">
  ${pageHeader}

  <div class="main-content main-content--article">
    ${abstract}
    ${feed}
  </div>
</article>
    `,
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
          case 'not-found':
            return {
              type: 'not-found',
              content: `
                <h1>Oops!</h1>
                <p>
                  We’re having trouble finding this information.
                  Ensure you have the correct URL, or try refreshing the page.
                  You may need to come back later.
                </p>
                <p>
                  <a href="/" class="u-call-to-action-link">Return to Homepage</a>
                </p>
              `,
            };
          case 'unavailable':
            return {
              type: 'unavailable',
              content: `
                <h1>Oops!</h1>
                <p>
                  We’re having trouble finding this information.
                  Ensure you have the correct URL, or try refreshing the page.
                  You may need to come back later.
                </p>
                <p>
                  <a href="/" class="u-call-to-action-link">Return to Homepage</a>
                </p>
              `,
            };
        }
      });
  };
};
