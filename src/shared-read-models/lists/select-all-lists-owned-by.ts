import * as O from 'fp-ts/Option';
import * as RM from 'fp-ts/ReadonlyMap';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructListsReadModel } from './construct-lists-read-model';
import { List } from './list';
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

type SelectAllListsOwnedBy = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => T.Task<ReadonlyArray<List>>;

export const selectAllListsOwnedBy: SelectAllListsOwnedBy = (groupId) => (events) => pipe(
  events,
  constructListsReadModel,
  T.map(RM.lookup(S.Eq)(groupId)),
  T.map(O.fold(
    () => [],
    (list) => [list],
  )),
  T.delay(1),
);
