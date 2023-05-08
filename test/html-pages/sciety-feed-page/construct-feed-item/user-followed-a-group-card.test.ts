import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity } from '../../../../src/domain-events';
import { userFollowedAGroupCard, Ports as UserFollowedAGroupCardPorts } from '../../../../src/html-pages/sciety-feed-page/construct-view-model/user-followed-a-group-card';
import {
  arbitraryDate, arbitraryString, arbitraryUri,
} from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroup } from '../../../types/group.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { arbitraryUserHandle } from '../../../types/user-handle.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/view-model';

describe('user-followed-a-group-card', () => {
  const userId = arbitraryUserId();
  const date = arbitraryDate();
  const group = arbitraryGroup();
  const event = userFollowedEditorialCommunity(userId, group.id, date);

  describe('happy path', () => {
    const avatarUrl = arbitraryUri();
    const handle = arbitraryUserHandle();
    const ports: UserFollowedAGroupCardPorts = {
      getGroup: () => O.some(group),
      lookupUser: () => O.some({
        handle,
        avatarUrl,
        id: arbitraryUserId(),
        displayName: arbitraryString(),
      }),
    };

    const viewModel = pipe(
      event,
      userFollowedAGroupCard(ports),
      O.getOrElseW(shouldNotBeCalled),
    );

    it('displays the user\'s avatar', async () => {
      expect(viewModel.avatarUrl).toStrictEqual(avatarUrl);
    });

    it('displays the user\'s handle in the title', async () => {
      expect(viewModel.titleText).toContain(handle);
    });

    it('displays the date of the event', async () => {
      expect(viewModel.date).toStrictEqual(date);
    });

    it('links to the group page about tab', async () => {
      expect(viewModel.linkUrl).toBe(`/groups/${group.slug}/about`);
    });

    it('includes the group\'s name in the details title', () => {
      expect(viewModel.details?.title).toContain(group.name);
    });

    it('includes the group\'s short description in the details content', () => {
      expect(viewModel.details?.content).toContain(group.shortDescription);
    });
  });

  describe('when the user details cannot be found', () => {
    let framework: TestFramework;
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      framework = createTestFramework();
      await framework.commandHelpers.createGroup(group);
      viewModel = pipe(
        event,
        userFollowedAGroupCard(framework.queries),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('replaces handle with "a user"', async () => {
      expect(viewModel.titleText).toMatch(/^A user/);
    });

    it('replaces avatar with a default image', async () => {
      expect(viewModel.avatarUrl).toBe('/static/images/sciety-logo.jpg');
    });

    it('links to the group page about tab', async () => {
      expect(viewModel.linkUrl).toBe(`/groups/${group.slug}/about`);
    });

    it('includes the group\'s name in the details title', () => {
      expect(viewModel.details?.title).toContain(group.name);
    });

    it('includes the group\'s short description in the details content', () => {
      expect(viewModel.details?.content).toContain(group.shortDescription);
    });
  });

  describe('when the group cannot be found', () => {
    const ports: UserFollowedAGroupCardPorts = {
      getGroup: () => O.none,
      lookupUser: () => O.some({
        handle: arbitraryUserHandle(),
        avatarUrl: arbitraryUri(),
        id: arbitraryUserId(),
        displayName: arbitraryString(),
      }),
    };

    const viewModel = pipe(
      event,
      userFollowedAGroupCard(ports),
    );

    it('fails the card', async () => {
      expect(viewModel).toStrictEqual(O.none);
    });
  });
});
