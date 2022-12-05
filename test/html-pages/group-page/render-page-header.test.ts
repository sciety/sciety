import { renderPageHeader } from '../../../src/html-pages/group-page/render-page-header';
import { arbitraryString } from '../../helpers';

describe('create render page', () => {
  describe('when the group exists', () => {
    it('renders the group name', async () => {
      const rendered = renderPageHeader({
        name: 'My group',
        avatarPath: '/images/xyz.png',
        shortDescription: arbitraryString(),
      });

      expect(rendered).toStrictEqual(expect.stringContaining('My group'));
    });
  });
});
