import { updateGroupMeta } from '../../../src/shared-components/group-card/update-group-meta';
import {
  editorialCommunityReviewedArticle,
  userFollowedEditorialCommunity, userSavedArticle,
  userUnfollowedEditorialCommunity,
} from '../../../src/types/domain-events';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('update-group-meta', () => {
  const groupId = arbitraryGroupId();
  const initial = { followerCount: 41, reviewCount: 27, latestActivityDate: new Date('1970') };

  it('updates the meta when passed a UserFollowedEditorialCommunityEvent', () => {
    const event = userFollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial, followerCount: 42 });
  });

  it('updates the meta when passed a UserUnfollowedEditorialCommunityEvent', () => {
    const event = userUnfollowedEditorialCommunity(arbitraryUserId(), groupId);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial, followerCount: 40 });
  });

  it('updates the meta when passed a newer EditorialCommunityReviewedArticle', () => {
    const newerDate = new Date('2020');
    const event = editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), newerDate);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial, reviewCount: 28, latestActivityDate: newerDate });
  });

  it('does not change the latestActivity date when passed an older EditorialCommunityReviewedArticle', () => {
    const olderDate = new Date('1920');
    const event = editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), olderDate);
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual({ ...initial, reviewCount: 28 });
  });

  it('does not update the meta when passed any other domain event', () => {
    const event = userSavedArticle(arbitraryUserId(), arbitraryDoi());
    const result = updateGroupMeta(groupId)(initial, event);

    expect(result).toStrictEqual(initial);
  });
});
