import { updateGroupMeta } from '../../src/search-results-page/update-group-meta';
import {
  editorialCommunityReviewedArticle,
  userFollowedEditorialCommunity, userSavedArticle,
  userUnfollowedEditorialCommunity,
} from '../../src/types/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('update-group-meta', () => {
  const groupId = arbitraryGroupId();
  const initial = { followerCount: 41, reviewCount: 27 };

  it('updates the meta when passed a UserFollowedEditorialCommunityEvent', () => {
    const event = userFollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ followerCount: 42, reviewCount: 27 });
  });

  it('updates the meta when passed a UserUnfollowedEditorialCommunityEvent', () => {
    const event = userUnfollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ followerCount: 40, reviewCount: 27 });
  });

  it('updates the meta when passed a EditorialCommunityReviewedArticle', () => {
    const event = editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryDoi());
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ followerCount: 41, reviewCount: 28 });
  });

  it('does not update the meta when passed any other domain event', () => {
    const event = userSavedArticle(arbitraryUserId(), arbitraryDoi());
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ followerCount: 41, reviewCount: 27 });
  });
});
