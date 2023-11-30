import { NonEmptyString } from 'io-ts-types';
import { ArticleId } from '../types/article-id';

export type PaperIdThatIsADoi = string & { readonly PaperIdThatIsADoi: unique symbol };

export const getDoiPortion = (paperId: PaperIdThatIsADoi): string => paperId;

export const toArticleId = (paperId: PaperIdThatIsADoi): ArticleId => new ArticleId(getDoiPortion(paperId));

export type PaperId = PaperIdThatIsADoi;

export const fromNonEmptyString = (candidate: NonEmptyString): PaperId => `${candidate}` as PaperIdThatIsADoi;
