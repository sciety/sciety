import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { getCorrespondingListId } from './get-corresponding-list-id.js';
import { isStateWithSubjectArea, ReadModel } from './handle-event.js';
import { ArticleId, fromString as doiFromString } from '../../types/article-id.js';
import { ListId } from '../../types/list-id.js';

type ArticleWithSubjectArea = { articleId: ArticleId, listId: ListId };

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
