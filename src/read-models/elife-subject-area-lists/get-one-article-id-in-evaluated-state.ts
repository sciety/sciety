import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import { ArticleId, fromString as doiFromString } from '../../types/article-id.js';

type GetOneArticleIdInEvaluatedState = () => O.Option<ArticleId>;

export const getOneArticleIdInEvaluatedState = (readModel: ReadModel): GetOneArticleIdInEvaluatedState => () => pipe(
  readModel,
  R.filter((item) => item.name === 'evaluated'),
  R.keys,
  RA.head,
  O.chain(doiFromString),
);
