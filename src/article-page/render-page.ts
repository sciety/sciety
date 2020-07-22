import { Maybe, Result } from 'true-myth';
import { RenderArticleAbstract } from './render-article-abstract';
import { RenderPageHeader } from './render-page-header';
import { RenderReviews } from './render-reviews';
import Doi from '../types/doi';

export type RenderPageError = {
  type: 'not-found',
  content: string,
};

type RenderPage = (doi: Doi) => Promise<Result<string, RenderPageError>>;

export default (
  renderPageHeader: RenderPageHeader,
  renderReviews: RenderReviews,
  renderAbstract: RenderArticleAbstract,
): RenderPage => {
  const template = Result.ok((abstract: string) => (pageHeader: string) => (reviews: Maybe<string>) => `
<article class="ui aligned stackable grid">
  <div class="row">
    <div class="column">
      ${pageHeader}
    </div>
  </div>

  <div class="row">
    <section class="column">
      ${abstract}
      ${reviews.unwrapOr('')}
    </section>
  </div>
</article>
    `);

  return async (doi) => {
    const abstractResult = renderAbstract(doi);
    const pageHeaderResult = renderPageHeader(doi);
    const reviews = renderReviews(doi);

    return template
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(Result.ok(await reviews))
      .mapErr(() => ({
        type: 'not-found',
        content: `${doi.value} not found`,
      }));
  };
};
