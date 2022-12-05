import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';

type GetGroupBySlug = (slug: string) => E.Either<DE.DataError, Group>;

export const getGroupBySlug = (readmodel: ReadModel): GetGroupBySlug => (slug) => pipe(
  Object.values(readmodel),
  RA.findFirst((group) => group.slug === slug),
  E.fromOption(() => DE.notFound),
);
