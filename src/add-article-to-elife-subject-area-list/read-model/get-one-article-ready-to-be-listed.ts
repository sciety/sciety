import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { getCorrespondingListId } from './get-corresponding-list-id';
import { ArticleStateWithSubjectArea, ReadModel } from './handle-event';
import { ArticleWithSubjectArea } from '../../shared-ports';
import { fromString as doiFromString } from '../../types/doi';

export const getOneArticleReadyToBeListed = (readModel: ReadModel) => (): O.Option<ArticleWithSubjectArea> => pipe(
  readModel,
  R.filter((state): state is ArticleStateWithSubjectArea => state.name === 'evaluated-and-subject-area-known'),
  R.toEntries,
  RA.head,
  O.chain(([articleIdAsString, state]) => pipe(
    doiFromString(articleIdAsString),
    O.map((articleId) => ({
      articleId,
      subjectArea: state.subjectArea,
    })),
  )),
  O.chain(({ articleId, subjectArea }) => pipe(
    subjectArea.value,
    getCorrespondingListId,
    O.map((listId) => ({
      articleId,
      listId,
    })),
  )),
);
