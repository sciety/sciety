import { renderPageHeader } from '../../src/group-page/render-page-header';

describe('create render page', () => {
  describe('when the group exists', () => {
    it('renders the group name', async () => {
      const rendered = renderPageHeader({
        name: 'My group',
        avatarPath: '/images/xyz.png',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('My group'));
    });
  });
});
