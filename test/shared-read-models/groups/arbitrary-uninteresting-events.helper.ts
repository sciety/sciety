import {
  evaluationRecorded, groupJoined, userFollowedEditorialCommunity, userSavedArticle,
} from '../../../src/domain-events';
import { arbitraryDate } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const group = arbitraryGroup();

export const arbitraryUninterestingEvents = [
  groupJoined(
    group.id,
    group.name,
    group.avatarPath,
    group.descriptionPath,
    group.shortDescription,
    group.homepage,
    group.slug,
  ),
  userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
  evaluationRecorded(group.id, arbitraryArticleId(), arbitraryEvaluationLocator(), [], arbitraryDate()),
  userSavedArticle(arbitraryUserId(), arbitraryArticleId()),
];
