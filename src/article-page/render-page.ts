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
  renderRecommendations: Component,
  renderReviews: Component,
  renderAbstract: Component,
): RenderPage => {
  const template = Result.ok((abstract: string) => (pageHeader: string) => (recommendations: string) => (reviews: string) => `
<article class="ui aligned stackable grid">
  <div class="row">
    <div class="column">
      ${pageHeader}
    </div>
  </div>

  <div class="row">
    <section class="column">
      ${abstract}
      ${recommendations}
      ${reviews}
    </section>
  </div>
</article>
    `);

  return async (doi) => {
    const abstractResult = renderAbstract(doi);
    const pageHeaderResult = renderPageHeader(doi);
    const recommendationsResult = renderRecommendations(doi);
    const reviews = renderReviews(doi)
      .then((reviewsResult) => (
        reviewsResult.orElse(() => Result.ok(''))
      ));

    return template
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await recommendationsResult)
      .ap(await reviews)
      .mapErr(() => ({
        type: 'not-found',
        content: `${doi.value} not found`,
      }));
  };
};
