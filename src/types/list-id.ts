import * as Eq from 'fp-ts/Eq';
import * as S from 'fp-ts/string';
import { v4 } from 'uuid';

export type ListId = string & { readonly ListId: unique symbol };

export const fromValidatedString = (value: string): ListId => value as ListId;

export const isListId = (value: unknown): value is ListId => typeof value === 'string';

export const generate = (): ListId => fromValidatedString(v4());

export const eqListId: Eq.Eq<ListId> = S.Eq;
