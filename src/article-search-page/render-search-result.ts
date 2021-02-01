import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import templateDate from '../shared-components/date';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type SearchResult = {
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
};

export type GetReviewCount = (doi: Doi) => TE.TaskEither<unknown, number>;

export type RenderSearchResult = (result: SearchResult) => T.Task<HtmlFragment>;

const renderReviewCount: (reviewCount: number) => string = (reviewCount) => (
  `
    <div>
      Reviews
      <span>${reviewCount}</span>
    </div>
  `
);

const renderIfNecessary = flow(
  O.fromPredicate((reviewCount: number) => reviewCount > 0),
  O.fold(() => '', renderReviewCount),
  toHtmlFragment,
);

const createRenderReviews = (
  getReviewCount: GetReviewCount,
) => (
  async (doi: Doi): Promise<HtmlFragment> => (
    pipe(
      doi,
      getReviewCount,
      TE.fold(
        () => T.of(toHtmlFragment('')),
        (reviewCount) => T.of(renderIfNecessary(reviewCount)),
      ),
    )()
  )
);

const templatePostedDate = (date: Date): HtmlFragment => toHtmlFragment(
  `<div class="search-results-list__item__date">Posted ${templateDate(date)}</div>`,
);

export default (
  getReviewCount: GetReviewCount,
): RenderSearchResult => {
  const renderReviews = createRenderReviews(getReviewCount);

  return (result) => async () => toHtmlFragment(`
    <div>
      <a class="search-results-list__item__link" href="/articles/${result.doi.value}">${result.title}</a>
      <div>
        ${result.authors}
      </div>
      ${templatePostedDate(result.postedDate)}
      <div>
        ${await renderReviews(result.doi)}
      </div>
    </div>
  `);
};
