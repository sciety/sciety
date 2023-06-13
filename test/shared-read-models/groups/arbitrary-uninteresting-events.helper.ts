import { constructEvent } from '../../../src/domain-events';
import { arbitraryDate } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { evaluationRecordedHelper } from '../../types/evaluation-recorded-event.helper';

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
  evaluationRecordedHelper(group.id, arbitraryArticleId(), arbitraryEvaluationLocator(), [], arbitraryDate()),
];
