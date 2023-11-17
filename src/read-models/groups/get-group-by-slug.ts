import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import { Group } from '../../types/group.js';

type GetGroupBySlug = (slug: string) => O.Option<Group>;

export const getGroupBySlug = (readmodel: ReadModel): GetGroupBySlug => (slug) => pipe(
  Object.values(readmodel),
  RA.findFirst((group) => group.slug === slug),
);
