import { JSDOM } from 'jsdom';
import { renderFollowToggle } from '../../src/follow/render-follow-toggle';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('render-follow-toggle', () => {
  describe('when the group is currently followed', () => {
    const groupId = arbitraryGroupId();
    const rendered = JSDOM.fragment(
      renderFollowToggle(groupId, 'My Group')(true),
    );
    const button = rendered.querySelector('button');

    it('shows an unfollow button', async () => {
      const buttonText = button?.textContent;

      expect(buttonText).toContain('Unfollow');
    });

    it('announces the action', async () => {
      const ariaLabel = button?.getAttribute('aria-label');

      expect(ariaLabel).toStrictEqual('Unfollow My Group');
    });
  });

  describe('when the group is not currently followed', () => {
    const groupId = arbitraryGroupId();
    const rendered = JSDOM.fragment(renderFollowToggle(groupId, 'My Group')(false));
    const button = rendered.querySelector('button');

    it('shows a follow button', async () => {
      const buttonText = button?.textContent;

      expect(buttonText).toContain('Follow');
    });

    it('announces the action', async () => {
      const ariaLabel = button?.getAttribute('aria-label');

      expect(ariaLabel).toStrictEqual('Follow My Group');
    });
  });
});
