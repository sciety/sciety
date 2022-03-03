import { toListOfListCards } from '../../../src/group-page/lists/to-list-of-list-cards';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('to-list-of-list-cards', () => {
  describe('when the group owns no lists', () => {
    const rendered = toListOfListCards([]);

    it('displays a message instead of cards', () => {
      expect(rendered).toContain('This group doesn\'t have any lists yet.');
    });
  });

  describe('when the group has one empty list', () => {
    const group = arbitraryGroup();
    const listTitle = arbitraryString();
    const rendered = toListOfListCards([
      {
        id: arbitraryListId(),
        name: listTitle,
        description: arbitraryString(),
        articleCount: 0,
        lastUpdated: arbitraryDate(),
        ownerId: group.id,
      },
    ]);

    it('displays a card for the list', () => {
      expect(rendered).toContain(listTitle);
    });
  });
});
