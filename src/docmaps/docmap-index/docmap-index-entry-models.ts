import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isGroupEvaluatedArticleEvent } from '../../domain-events';
import * as Doi from '../../types/doi';
import * as GID from '../../types/group-id';
import { GroupId } from '../../types/group-id';

export type DocmapIndexEntryModel = {
  articleId: Doi.Doi,
  groupId: GID.GroupId,
  updated: Date,
};

type DocmapIndexEntryModels = (
  supportedGroupId: GroupId
) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<DocmapIndexEntryModel>;

export const docmapIndexEntryModels: DocmapIndexEntryModels = (supportedGroupId) => (events) => pipe(
  events,
  RA.filter(isGroupEvaluatedArticleEvent),
  RA.filter(({ groupId }) => supportedGroupId === groupId),
  RA.map(({ articleId, groupId, date }) => ({
    articleId,
    groupId,
    updated: date,
  })),
);
