import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export type GroupId = string & { readonly GroupId: unique symbol };

export const isGroupId = (value: unknown): value is GroupId => typeof value === 'string' && value !== '';

export const fromString = (value: string): O.Option<GroupId> => O.some(value as GroupId);

export const fromValidatedString = (value: string): GroupId => value as GroupId;

export const fromNullable = (value?: string | null): O.Option<GroupId> => pipe(
  value,
  O.fromNullable,
  O.chain(fromString),
);
