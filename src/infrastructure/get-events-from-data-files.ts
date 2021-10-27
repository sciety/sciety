import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { evaluationEventsFilepathForGroupId, readEventsFile } from './events-file';
import { DomainEvent, groupEvaluatedArticle } from '../domain-events';
import { GroupId } from '../types/group-id';

export const getEventsFromDataFiles = (
  groupIds: RNEA.ReadonlyNonEmptyArray<GroupId>,
): TE.TaskEither<unknown, RNEA.ReadonlyNonEmptyArray<DomainEvent>> => pipe(
  groupIds,
  TE.traverseArray((groupId) => pipe(
    groupId,
    evaluationEventsFilepathForGroupId,
    readEventsFile,
    TE.map(RA.map(({
      date, articleDoi, evaluationLocator, authors,
    }) => groupEvaluatedArticle(
      groupId,
      articleDoi,
      evaluationLocator,
      date,
      authors,
    ))),
  )),
  TE.chainEitherKW(flow(
    RA.flatten,
    RNEA.fromReadonlyArray,
    E.fromOption(constant('No events found')),
  )),
);
