import { renderPageHeader } from '../../src/group-page/render-page-header';

describe('create render page', () => {
  describe('when the community exists', () => {
    it('renders the community name', async () => {
      const rendered = renderPageHeader({
        name: 'My Community',
        avatarPath: '/images/xyz.png',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('My Community'));
    });
  });
});
