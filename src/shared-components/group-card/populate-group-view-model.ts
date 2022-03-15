import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GroupViewModel } from './render-group-card';
import { updateGroupMeta } from './update-group-meta';
import { DomainEvent } from '../../domain-events';
import { callListsReadModelService } from '../../group-page/lists/call-lists-read-model-service';
import { Logger } from '../../infrastructure';
import { getGroup } from '../../shared-read-models/groups';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const addFeaturedArticlesListsToListCount = (groupSlug: string) => (listCount: number): TE.TaskEither<never, number> => {
  switch (groupSlug) {
    case 'ncrc':
      return TE.right(listCount + 1);
    case 'biophysics-colab':
      return TE.right(listCount + 1);
    case 'elife':
      return TE.right(listCount + 8);
    default:
      return TE.right(listCount);
  }
};

export type Ports = {
  getAllEvents: GetAllEvents,
  logger: Logger,
};

export const populateGroupViewModel = (
  ports: Ports,
) => (
  groupId: GroupId,
): TE.TaskEither<DE.DataError, GroupViewModel> => pipe(
  ports.getAllEvents,
  T.map(getGroup(groupId)),
  TE.chainTaskK((group) => pipe(
    ports.getAllEvents,
    T.map(RA.reduce({ evaluationCount: 0, followerCount: 0, latestActivity: O.none }, updateGroupMeta(group.id))),
    T.map((meta) => ({
      ...group,
      ...meta,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
  TE.chainW((partial) => pipe(
    // addFeaturedArticlesListsToListCount(partial.slug)(1),
    callListsReadModelService(ports.logger, groupId),
    TE.map((lists) => lists.length),
    TE.map((listCount) => ({
      ...partial,
      listCount,
    })),
  )),
);
