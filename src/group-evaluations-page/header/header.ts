import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderHeader } from './render-header';
import { DomainEvent } from '../../domain-events';
import { getEvaluatedArticlesListDetails } from '../../group-page/lists/get-evaluated-articles-list-details';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = {
  getAllEvents: GetAllEvents,
};

export const header = (
  ports: Ports,
  group: Group,
): TE.TaskEither<never, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map((events) => ({
    grp: group,
    ...getEvaluatedArticlesListDetails(group.id)(events),
  })),
  T.map(({ grp, articleCount, lastUpdated }) => renderHeader(grp, articleCount, lastUpdated)),
  TE.rightTask,
);
