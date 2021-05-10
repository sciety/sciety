import { toHtmlFragment } from '../../src/types/html-fragment';
import { renderPage } from '../../src/user-page/render-page';
import { arbitraryWord } from '../helpers';

describe('render-page', () => {
  describe('when the user display name is known', () => {
    it('is used as the page title', async () => {
      const userDisplayName = arbitraryWord();
      const rendered = renderPage({
        header: toHtmlFragment(''),
        followList: toHtmlFragment(''),
        savedArticles: toHtmlFragment(''),
        userDisplayName,
      });

      expect(rendered).toStrictEqual(expect.objectContaining({ title: userDisplayName }));
    });
  });
});
