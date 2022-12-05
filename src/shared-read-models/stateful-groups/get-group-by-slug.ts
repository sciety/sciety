import * as E from 'fp-ts/Either';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { ReadModel } from './handle-event';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';

const byName: Ord.Ord<Group> = pipe(
  S.Ord,
  Ord.contramap((group) => group.name),
);

type GetGroupBySlug = (slug: string) => E.Either<DE.DataError, Group>;

// ts-unused-exports:disable-next-line
export const getGroupBySlug = (r: ReadModel): GetGroupBySlug => (slug) => pipe(
  Object.values(r),
  RA.sort(byName),
  RA.findFirst((group) => group.slug === slug),
  E.fromOption(() => DE.notFound),
);
