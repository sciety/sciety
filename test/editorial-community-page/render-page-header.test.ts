import { renderPageHeader } from '../../src/editorial-community-page/render-page-header';

describe('create render page', (): void => {
  describe('when the community exists', (): void => {
    it('renders the community name', async (): Promise<void> => {
      const rendered = renderPageHeader({
        name: 'My Community',
        avatarPath: '/images/xyz.png',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('My Community'));
    });
  });
});
