import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { DomainEvent } from '../../domain-events/domain-event';
import { getGroup } from '../../shared-read-models/groups';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';

export type GroupEvaluatedMultipleArticlesCard = {
  groupId: GroupId,
  articleCount: number,
  date: Date,
};

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const groupEvaluatedMultipleArticlesCard = (ports: Ports) => (
  card: GroupEvaluatedMultipleArticlesCard,
): TE.TaskEither<DE.DataError, ScietyFeedCard> => pipe(
  ports.getAllEvents,
  T.map(getGroup(card.groupId)),
  TE.map((group) => pipe(
    {
      titleText: `${group.name} evaluated ${card.articleCount} articles`,
      linkUrl: `/groups/${group.slug}/evaluated-articles`,
      avatarUrl: group.avatarPath,
      date: card.date,
    },
  )),
);
