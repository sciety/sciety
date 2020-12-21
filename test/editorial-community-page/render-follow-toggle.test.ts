import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { JSDOM } from 'jsdom';
import createRenderFollowToggle, { Follows } from '../../src/editorial-community-page/render-follow-toggle';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import toUserId from '../../src/types/user-id';

describe('render-follow-toggle', () => {
  describe('the user is logged in', () => {
    describe('when the community is currently followed', () => {
      it('shows an unfollow button', async () => {
        const userId = toUserId('u1');
        const editorialCommunityId = new EditorialCommunityId('');

        const follows: Follows = () => T.of(true);
        const renderFollowToggle = createRenderFollowToggle(follows);

        const rendered = JSDOM.fragment(
          await renderFollowToggle(O.some(userId), editorialCommunityId)(),
        );

        const button = rendered.querySelector('button');
        const buttonText = button?.textContent;

        expect(buttonText).toBe('Unfollow');
      });
    });

    describe('when the community is not currently followed', () => {
      it('shows a follow button', async () => {
        const userId = toUserId('u1');
        const editorialCommunityId = new EditorialCommunityId('');

        const follows: Follows = () => T.of(false);
        const renderFollowToggle = createRenderFollowToggle(follows);

        const rendered = JSDOM.fragment(await renderFollowToggle(O.some(userId), editorialCommunityId)());

        const button = rendered.querySelector('button');
        const buttonText = button?.textContent;

        expect(buttonText).toBe('Follow');
      });
    });
  });

  describe('the user is not logged in', () => {
    it('shows a follow button', async () => {
      const editorialCommunityId = new EditorialCommunityId('');

      const follows: Follows = () => T.of(false);
      const renderFollowToggle = createRenderFollowToggle(follows);

      const rendered = JSDOM.fragment(await renderFollowToggle(O.none, editorialCommunityId)());

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Follow');
    });
  });
});
