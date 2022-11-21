import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from '.';
import { ArticleStateWithSubjectArea } from './handle-event';
import { fromString as doiFromString } from '../../types/doi';
import { ArticleWithSubjectArea } from '../add-article-to-elife-subject-area-lists-saga';

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
);
