import { toHtmlFragment } from '../../src/types/html-fragment';
import { renderPage } from '../../src/user-page/render-page';

describe('render-page', () => {
  describe('when the user display name is known', () => {
    it('is used as the page title', async () => {
      const rendered = renderPage({
        header: toHtmlFragment(''),
        followList: toHtmlFragment(''),
        savedArticles: toHtmlFragment(''),
        userDisplayName: 'someone',
      });

      expect(rendered).toStrictEqual(expect.objectContaining({ title: 'someone' }));
    });
  });
});
