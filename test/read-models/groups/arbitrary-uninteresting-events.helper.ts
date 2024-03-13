import { constructEvent } from '../../../src/domain-events';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';

const groupId = arbitraryGroupId();

export const arbitraryUninterestingEvents = [
  arbitraryGroupJoinedEvent(groupId),
  constructEvent('UserFollowedEditorialCommunity')({ userId: arbitraryUserId(), editorialCommunityId: arbitraryGroupId() }),
  {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
  },
];
