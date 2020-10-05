import { Result } from 'true-myth';
import Doi from '../types/doi';

export type RenderPageError = {
  type: 'not-found',
  content: string,
};

export type Component = (doi: Doi) => Promise<Result<string, 'not-found' | 'unavailable' | 'no-content'>>;
type RenderPage = (doi: Doi) => Promise<Result<string, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderAbstract: Component,
  renderFeed: Component,
): RenderPage => {
  const template = Result.ok(
    (abstract: string) => (pageHeader: string) => (feed: string) => `
<article class="hive-grid hive-grid--article">
  ${pageHeader}

  <div class="main-content">
    ${abstract}
    ${feed}
  </div>
</article>
    `,
  );

  return async (doi) => {
    const abstractResult = renderAbstract(doi);
    const pageHeaderResult = renderPageHeader(doi);
    const feedResult = renderFeed(doi)
      .then((feed) => (
        feed.orElse(() => Result.ok(''))
      ));

    return template
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
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
