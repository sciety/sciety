import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { userFollowedAGroupCard } from '../../../../src/html-pages/sciety-feed-page/construct-view-model/user-followed-a-group-card';
import { arbitraryDate } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroup } from '../../../types/group.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/view-model';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { constructEvent } from '../../../../src/domain-events';
import { Dependencies } from '../../../../src/html-pages/sciety-feed-page/construct-view-model';

describe('user-followed-a-group-card', () => {
  const userDetails = arbitraryUserDetails();
  const date = arbitraryDate();
  const group = arbitraryGroup();
  const event = constructEvent('UserFollowedEditorialCommunity')({
    userId: userDetails.id,
    editorialCommunityId: group.id,
    date,
  });
  let framework: TestFramework;
  let dependencies: Dependencies;

  beforeEach(async () => {
    framework = createTestFramework();
    dependencies = {
      ...framework.dependenciesForViews,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('happy path', () => {
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.deprecatedCreateUserAccount(userDetails);
      viewModel = pipe(
        event,
        userFollowedAGroupCard(dependencies),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('displays the user\'s avatar', async () => {
      expect(viewModel.avatarUrl).toStrictEqual(userDetails.avatarUrl);
    });

    it('displays the user\'s handle in the title', async () => {
      expect(viewModel.titleText).toContain(userDetails.handle);
    });

    it('displays the date of the event', async () => {
      expect(viewModel.date).toStrictEqual(date);
    });

    it('links to the group page', async () => {
      expect(viewModel.linkUrl).toBe(`/groups/${group.slug}`);
    });

    it('includes the group\'s name in the details title', () => {
      expect(viewModel.details?.title).toContain(group.name);
    });

    it('includes the group\'s short description in the details content', () => {
      expect(viewModel.details?.content).toContain(group.shortDescription);
    });
  });

  describe('when the user details cannot be found', () => {
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group);
      viewModel = pipe(
        event,
        userFollowedAGroupCard(dependencies),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('replaces handle with "a user"', async () => {
      expect(viewModel.titleText).toMatch(/^A user/);
    });

    it('replaces avatar with a default image', async () => {
      expect(viewModel.avatarUrl).toBe('/static/images/sciety-logo.jpg');
    });

    it('links to the group page', async () => {
      expect(viewModel.linkUrl).toBe(`/groups/${group.slug}`);
    });

    it('includes the group\'s name in the details title', () => {
      expect(viewModel.details?.title).toContain(group.name);
    });

    it('includes the group\'s short description in the details content', () => {
      expect(viewModel.details?.content).toContain(group.shortDescription);
    });
  });

  describe('when the group cannot be found', () => {
    let viewModel: O.Option<ScietyFeedCard>;

    beforeEach(() => {
      viewModel = pipe(
        event,
        userFollowedAGroupCard(dependencies),
      );
    });

    it('fails the card', async () => {
      expect(viewModel).toStrictEqual(O.none);
    });
  });
});
