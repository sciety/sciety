import { constructEvent } from '../../../src/domain-events';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const groupJoinedEvent = arbitraryGroupJoinedEvent();

export const arbitraryUninterestingEvents = [
  groupJoinedEvent,
  constructEvent('UserFollowedEditorialCommunity')({ userId: arbitraryUserId(), editorialCommunityId: arbitraryGroupId() }),
  {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId: groupJoinedEvent.groupId,
  },
];
