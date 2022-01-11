import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupCreated, userFollowedEditorialCommunity } from '../../../src/domain-events';
import { userFollowedAGroupCard } from '../../../src/sciety-feed-page/cards';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import * as DE from '../../../src/types/data-error';
import { arbitraryDate, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-followed-a-group-card', () => {
  const userId = arbitraryUserId();
  const date = arbitraryDate();
  const group = arbitraryGroup();
  const event = userFollowedEditorialCommunity(userId, group.id, date);

  describe('happy path', () => {
    const avatarUrl = arbitraryUri();
    const handle = arbitraryWord();
    const ports = {
      getAllEvents: T.of([groupCreated(group)]),
      getUserDetails: () => TE.right({ handle, avatarUrl }),
    };

    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      viewModel = await pipe(
        event,
        userFollowedAGroupCard(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

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

  describe('when the user details cannot be obtained', () => {
    const ports = {
      getAllEvents: T.of([groupCreated(group)]),
      getUserDetails: () => TE.left(DE.unavailable),
    };

    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      viewModel = await pipe(
        event,
        userFollowedAGroupCard(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
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
    const ports = {
      getAllEvents: T.of([]),
      getUserDetails: () => TE.right({
        handle: arbitraryWord(),
        avatarUrl: arbitraryUri(),
      }),
    };

    let viewModel: E.Either<DE.DataError, ScietyFeedCard>;

    beforeEach(async () => {
      viewModel = await pipe(
        event,
        userFollowedAGroupCard(ports),
      )();
    });

    it('fails the card', async () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });
});
