import { JSDOM } from 'jsdom';
import { renderFollowToggle } from '../../src/group-page/render-follow-toggle';
import { GroupId } from '../../src/types/group-id';

describe('render-follow-toggle', () => {
  describe('when the community is currently followed', () => {
    it('shows an unfollow button', async () => {
      const groupId = new GroupId('');
      const rendered = JSDOM.fragment(
        renderFollowToggle(groupId)(true),
      );
      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Unfollow');
    });
  });

  describe('when the community is not currently followed', () => {
    it('shows a follow button', async () => {
      const groupId = new GroupId('');
      const rendered = JSDOM.fragment(renderFollowToggle(groupId)(false));
      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Follow');
    });
  });
});
