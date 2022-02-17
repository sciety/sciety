import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toListOfListCards } from '../../../src/group-page/lists/to-list-of-list-cards';
import { HtmlFragment } from '../../../src/types/html-fragment';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroup } from '../../types/group.helper';

describe('to-list-of-list-cards', () => {
  describe('when the group owns no lists', () => {
    let rendered: HtmlFragment;

    beforeEach(async () => {
      rendered = await pipe(
        [],
        toListOfListCards(
          {
            getAllEvents: T.of([]),
          },
          arbitraryGroup(),
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays a message instead of cards', () => {
      expect(rendered).toContain('This group doesn\'t have any lists yet.');
    });
  });

  describe('when the group has one empty list', () => {
    const group = arbitraryGroup();
    const listTitle = arbitraryString();
    let rendered: HtmlFragment;

    beforeEach(async () => {
      rendered = await pipe(
        [
          {
            name: listTitle,
            description: arbitraryString(),
            articleCount: 0,
            lastUpdated: O.some(arbitraryDate()),
            ownerId: group.id,
          },
        ],
        toListOfListCards(
          {
            getAllEvents: T.of([]),
          },
          group,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays a card for the list', () => {
      expect(rendered).toContain(listTitle);
    });
  });

  describe('when the group has two lists containing articles', () => {
    it.todo('displays the most recently updated list at the top');
  });
});
