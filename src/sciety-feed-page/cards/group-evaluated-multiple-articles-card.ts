import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

type GetGroup = (id: GroupId) => TE.TaskEither<DE.DataError, Group>;

export type GroupEvaluatedMultipleArticlesCard = {
  groupId: GroupId,
  articleCount: number,
  date: Date,
};

export type Ports = { getGroup: GetGroup };

export const groupEvaluatedMultipleArticlesCard = (ports: Ports) => (
  card: GroupEvaluatedMultipleArticlesCard,
): TE.TaskEither<DE.DataError, ScietyFeedCard> => pipe(
  card.groupId,
  ports.getGroup,
  TE.map((group) => pipe(
    {
      titleText: `${group.name} evaluated ${card.articleCount} articles`,
      linkUrl: `/groups/${group.slug}/evaluated-articles`,
      avatarUrl: group.avatarPath,
      date: card.date,
    },
  )),
);
