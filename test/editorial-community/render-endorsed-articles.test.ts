import createRenderEndorsedArticles from '../../src/editorial-community-page/render-endorsed-articles';

describe('render-endorsed-articles component', (): void => {
  describe('when there are no endorsed artiles', (): void => {
    it('does not display the component heading', (): void => {
      const renderEndorsedArticles = createRenderEndorsedArticles();
      const rendered = renderEndorsedArticles('any-old-id');

      expect(rendered).toStrictEqual(expect.not.stringContaining('<h2'));
    });
  });
});
