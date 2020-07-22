import { Result } from 'true-myth';
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
    const abstractResult = await renderAbstract(doi);
    const pageHeaderResult = await renderPageHeader(doi);
    const reviews = await renderReviews(doi);

    return template
      .ap(abstractResult)
      .ap(pageHeaderResult)
      .ap(Result.ok(reviews))
      .mapErr(() => ({
        type: 'not-found',
        content: `${doi.value} not found`,
      }));
  };
};
