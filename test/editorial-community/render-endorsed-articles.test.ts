import { JSDOM } from 'jsdom';
import createRenderEndorsedArticles from '../../src/editorial-community-page/render-endorsed-articles';

describe('render-endorsed-articles component', (): void => {
  describe('when there are no endorsed articles', (): void => {
    it('does not display anything', async (): Promise<void> => {
      const renderEndorsedArticles = createRenderEndorsedArticles();
      const rendered = JSDOM.fragment(await renderEndorsedArticles('any-old-id'));

      expect(rendered.childNodes).toHaveLength(0);
    });
  });
});
