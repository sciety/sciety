import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { renderOurLists } from '../../../src/group-page/about/render-our-lists';
import { arbitraryString } from '../../helpers';

describe('render-our-lists', () => {
  describe('when the group has more than three lists', () => {
    it.todo('renders a slimline card for only three lists');

    it.todo('displays a View All Lists button');

    it.todo('the View All Lists button links to the lists tab');
  });

  describe('when the group has three or fewer lists', () => {
    it('renders a slimline card for each list', () => {
      const rendered: DocumentFragment = pipe(
        [
          `<li class="slimline-card">${arbitraryString()}</li>`,
          `<li class="slimline-card">${arbitraryString()}</li>`,
          `<li class="slimline-card">${arbitraryString()}</li>`,
        ],
        renderOurLists,
        JSDOM.fragment,
      );
      const slimlineCards = rendered.querySelectorAll('.slimline-card');

      expect(slimlineCards).toHaveLength(3);
    });

    it.todo('does not display a View All Lists button');
  });

  describe('when the group has no lists', () => {
    it.todo('tbd');
  });
});
