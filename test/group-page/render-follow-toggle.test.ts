import { JSDOM } from 'jsdom';
import { renderFollowToggle } from '../../src/group-page/render-follow-toggle';
import { GroupId } from '../../src/types/group-id';

describe('render-follow-toggle', () => {
  describe('when the community is currently followed', () => {
    it('shows an unfollow button', async () => {
      const groupId = new GroupId('1234');
      const rendered = JSDOM.fragment(
        renderFollowToggle(groupId, 'My Group')(true),
      );
      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toContain('Unfollow');
    });
  });

  describe('when the community is not currently followed', () => {
    it('shows a follow button', async () => {
      const groupId = new GroupId('1234');
      const rendered = JSDOM.fragment(renderFollowToggle(groupId, 'My Group')(false));
      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toContain('Follow');
    });
  });
});
