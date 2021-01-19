import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { constant } from 'fp-ts/lib/function';
import { renderSaveArticle } from '../../src/article-page/render-save-article';
import Doi from '../../src/types/doi';

describe('render-save-article', () => {
  describe('not logged in', () => {
    it('renders nothing', async () => {
      const projection = jest.fn().mockImplementation(constant(T.of(false)));
      const render = renderSaveArticle(projection);
      const rendered = await render(new Doi('10.1111/foobar'), O.none)();

      expect(rendered).toStrictEqual('');
      expect(projection).not.toHaveBeenCalled();
    });
  });

  describe('logged in and article is saved', () => {
    it.todo('renders is-saved-link');
  });

  describe('logged in and article is not saved', () => {
    it.todo('renders save-to-your-list-form');
  });
});
