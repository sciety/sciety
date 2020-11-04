import { Maybe, Result } from 'true-myth';
import Doi from '../types/doi';
import { UserId } from '../types/user-id';

type Page = {
  content: string,
  title: string,
};

type RenderPageError = {
  type: 'not-found',
  content: string,
};

type Component = (doi: Doi, userId: Maybe<UserId>) => Promise<Result<string, 'not-found' | 'unavailable' | 'no-content'>>;
export type RenderPage = (doi: Doi, userId: Maybe<UserId>) => Promise<Result<Page, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderAbstract: Component,
  renderFeed: Component,
): RenderPage => {
  const template = Result.ok(
    (abstract: string) => (pageHeader: string) => (feed: string) => (title: string) => ({
      content: `
<article class="hive-grid hive-grid--article">
  ${pageHeader}

  <div class="main-content main-content--article">
    ${abstract}
    ${feed}
  </div>
</article>
    `,
      title,
    }),
  );

  return async (doi, userId) => {
    const abstractResult = renderAbstract(doi, userId);
    const pageHeaderResult = renderPageHeader(doi, userId);
    const feedResult = renderFeed(doi, userId)
      .then((feed) => (
        feed.orElse(() => Result.ok(''))
      ));
    const titleResult = Result.ok('Article on Sciety');

    return template
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
      .ap(titleResult)
      .mapErr(() => ({
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
      }));
  };
};
