import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
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
    <div class="ui label">
      Reviews
      <span class="detail">${reviewCount}</span>
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
  `<div class="meta">Posted ${templateDate(date)}</div>`,
);

export default (
  getReviewCount: GetReviewCount,
): RenderSearchResult => {
  const renderReviews = createRenderReviews(getReviewCount);

  return (result) => async () => toHtmlFragment(`
    <div class="content">
      <a class="header" href="/articles/${result.doi.value}">${result.title}</a>
      <div class="meta">
        ${result.authors}
      </div>
      ${templatePostedDate(result.postedDate)}
      <div class="extra">
        ${await renderReviews(result.doi)}
      </div>
    </div>
  `);
};
