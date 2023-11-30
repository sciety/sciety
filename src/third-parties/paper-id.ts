import { NonEmptyString } from 'io-ts-types';

export type PaperIdThatIsADoi = string & { readonly PaperIdThatIsADoi: unique symbol };

export const getDoiPortion = (paperId: PaperIdThatIsADoi): string => paperId;

export type PaperId = PaperIdThatIsADoi;

export const fromNonEmptyString = (candidate: NonEmptyString): PaperId => `${candidate}` as PaperIdThatIsADoi;
