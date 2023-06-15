import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { getCorrespondingListId } from './get-corresponding-list-id';
import { isStateWithSubjectArea, ReadModel } from './handle-event';
import { Doi, fromString as doiFromString } from '../../types/doi';
import { ListId } from '../../types/list-id';

type ArticleWithSubjectArea = { articleId: Doi, listId: ListId };

type GetOneArticleReadyToBeListed = () => O.Option<ArticleWithSubjectArea>;

export const getOneArticleReadyToBeListed = (readModel: ReadModel): GetOneArticleReadyToBeListed => () => pipe(
  readModel,
  R.filter(isStateWithSubjectArea),
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
    subjectArea,
    getCorrespondingListId,
    O.map((listId) => ({
      articleId,
      listId,
    })),
  )),
);
