import * as E from 'fp-ts/Either';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructReadModel } from './construct-read-model';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';

const byName: Ord.Ord<Group> = pipe(
  S.Ord,
  Ord.contramap((group) => group.name),
);

type GetGroupBySlug = (slug: string) => (events: ReadonlyArray<DomainEvent>) => E.Either<DE.DataError, Group>;

export const getGroupBySlug: GetGroupBySlug = (slug: string) => flow(
  constructReadModel,
  RM.values(byName),
  RA.findFirst((group) => group.slug === slug),
  E.fromOption(() => DE.notFound),
);
