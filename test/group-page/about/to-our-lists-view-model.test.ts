import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { renderOurLists } from '../../../src/group-page/about/render-our-lists';
import { arbitraryString } from '../../helpers';

describe('to-our-lists-view-model', () => {
  describe('when the group has more than three lists', () => {
    it.todo('returns slimline card view models for only three lists');

    it.todo('the View All Lists button is set');

    it.todo('the View All Lists button is a link to the lists tab');
  });

  describe('when the group has three or fewer lists', () => {
    it('returns slimline card view models for each list', () => {
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

    it.todo('the View All Lists button is not set');
  });

  describe('when the group has no lists', () => {
    it.todo('tbd');
  });
});
