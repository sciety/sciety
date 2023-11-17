import { constructEvent } from '../../../src/domain-events/index.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';
import { arbitraryGroup } from '../../types/group.helper.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper.js';

const group = arbitraryGroup();

export const arbitraryUninterestingEvents = [
  constructEvent('GroupJoined')({
    groupId: group.id,
    name: group.name,
    avatarPath: group.avatarPath,
    descriptionPath: group.descriptionPath,
    shortDescription: group.shortDescription,
    homepage: group.homepage,
    slug: group.slug,
  }),
  constructEvent('UserFollowedEditorialCommunity')({ userId: arbitraryUserId(), editorialCommunityId: arbitraryGroupId() }),
  {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId: group.id,
  },
];
