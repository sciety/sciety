import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { noEvaluatedArticlesMessage } from '../list-page/evaluated-articles-list/static-messages';
import { paginate } from '../shared-components/paginate';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const toPageOfCards = () => T.of(toHtmlFragment(''));

export const articlesList = (
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  [],
  TE.right,
  TE.chain(RA.match(
    () => TE.right(noEvaluatedArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(toPageOfCards),
    ),
  )),
);
