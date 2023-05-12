import * as RM from 'fp-ts/ReadonlyMap';
import * as S from 'fp-ts/string';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ArticleDetails, ReadModel } from './handle-event';
import { Doi } from '../../types/doi';

export type LookupArticleDetails = (articleId: Doi) => O.Option<ArticleDetails>;

export const lookupArticleDetails = (readmodel: ReadModel) => (articleId: Doi) => pipe(
  readmodel,
  RM.lookup(S.Eq)(articleId.value),
);
