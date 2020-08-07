import { Result } from 'true-myth';
import Doi from '../types/doi';

export type RenderPageError = {
  type: 'not-found',
  content: string,
};

type Component = (doi: Doi) => Promise<Result<string, 'not-found' | 'unavailable' | 'no-content'>>;
type RenderPage = (doi: Doi) => Promise<Result<string, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderReviews: Component,
  renderAbstract: Component,
): RenderPage => {
  const template = Result.ok((abstract: string) => (pageHeader: string) => (reviews: string) => `
<article class="ui aligned stackable grid">
  <div class="row">
    <div class="column">
      ${pageHeader}
    </div>
  </div>

  <div class="row">
    <section class="column">
      ${abstract}
      ${reviews}
    </section>
  </div>
</article>
    `);

  return async (doi) => {
    const abstractResult = renderAbstract(doi);
    const pageHeaderResult = renderPageHeader(doi);
    const reviews = renderReviews(doi)
      .then((reviewsResult) => (
        reviewsResult.orElse(() => Result.ok(''))
      ));

    return template
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await reviews)
      .mapErr(() => ({
        type: 'not-found',
        content: `${doi.value} not found`,
      }));
  };
};
