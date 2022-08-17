import * as RM from 'fp-ts/ReadonlyMap';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructReadModel } from './construct-read-model';
import { List } from './list';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { ListId } from '../../types/list-id';

type GetList = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<DE.DataError, List>;

export const getList: GetList = (listId) => (events) => pipe(
  events,
  constructReadModel,
  RM.lookup(S.Eq)(listId),
  TE.fromOption(() => DE.notFound),
);
