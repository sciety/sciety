import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toOurListsViewModel } from '../../../src/group-page/about/to-our-lists-view-model';
import { List } from '../../../src/shared-read-models/lists';
import { arbitraryDate, arbitraryNumber, arbitraryString } from '../../helpers';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

const arbitraryList = (): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  articleCount: arbitraryNumber(0, 100),
  lastUpdated: arbitraryDate(),
  ownerId: arbitraryListOwnerId(),
});

describe('to-our-lists-view-model', () => {
  describe('when the group has more than three lists', () => {
    const model = pipe(
      [
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
      ],
      toOurListsViewModel,
    );

    it('returns slimline card view models for only three lists', () => {
      expect(model.slimlineCards).toHaveLength(3);
    });

    it.failing('the View All Lists button is set', () => {
      expect(O.isSome(model.viewAllListsUrl)).toBe(true);
    });

    it.todo('the View All Lists button is a link to the lists tab');
  });

  describe('when the group has three or fewer lists', () => {
    const model = pipe(
      [
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
      ],
      toOurListsViewModel,
    );

    it('returns slimline card view models for each list', () => {
      expect(model.slimlineCards).toHaveLength(3);
    });

    it('the View All Lists button is not set', () => {
      expect(O.isNone(model.viewAllListsUrl)).toBe(true);
    });
  });

  describe('when the group has no lists', () => {
    it.todo('tbd');
  });
});
