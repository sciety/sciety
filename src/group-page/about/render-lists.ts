import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ListViewModel = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
  href: string,
  title: string,
};

type RenderList = (list: ListViewModel) => HtmlFragment;

const renderList: RenderList = (list) => toHtmlFragment(`<li>${list.title} ${list.articleCount} Articles Updated: ${list.lastUpdated.toString()}</li>`);

export const renderLists = (lists: ReadonlyArray<ListViewModel>): TE.TaskEither<DE.DataError, HtmlFragment> => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return pipe(
      lists,
      RA.map(renderList),
      (list) => list.join(''),
      (renderedLists) => `
        <h3>Our lists</h3>
        <ul>
          ${renderedLists}
        </ul>
      `,
      toHtmlFragment,
      TE.right,
    );
  }

  return TE.right(toHtmlFragment(''));
};
