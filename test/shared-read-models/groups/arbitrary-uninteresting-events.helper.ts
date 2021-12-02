import {
  evaluationRecorded, groupCreated, userFollowedEditorialCommunity, userSavedArticle,
} from '../../../src/domain-events';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const group = arbitraryGroup();

export const arbitraryUninterestingEvents = [
  groupCreated(arbitraryGroup()),
  userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
  evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
  userSavedArticle(arbitraryUserId(), arbitraryDoi()),
];
