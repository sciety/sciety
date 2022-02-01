import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { listCreated } from '../../../src/domain-events/list-created-event';
import { lists } from '../../../src/group-page/lists/lists';
import { HtmlFragment } from '../../../src/types/html-fragment';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('lists', () => {
  describe('when the group owns no lists', () => {
    let rendered: HtmlFragment;

    beforeEach(async () => {
      rendered = await pipe(
        arbitraryGroup(),
        lists({
          getAllEvents: T.of([]),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays a message instead of cards', () => {
      expect(rendered).toContain('This group doesn\'t have any lists yet.');
    });
  });

  describe('when the group has two empty lists', () => {
    const group = arbitraryGroup();
    const firstListTitle = arbitraryString();
    const secondListTitle = arbitraryString();
    let rendered: HtmlFragment;

    beforeEach(async () => {
      rendered = await pipe(
        group,
        lists({
          getAllEvents: T.of([
            listCreated(
              arbitraryListId(),
              firstListTitle,
              arbitraryString(),
              group.id,
            ),
            listCreated(
              arbitraryListId(),
              secondListTitle,
              arbitraryString(),
              group.id,
            ),
          ]),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.skip('displays a card for the first list', () => {
      expect(rendered).toContain(firstListTitle);
    });

    it('displays a card for the second list', () => {
      expect(rendered).toContain(secondListTitle);
    });

    it.todo('displays a total of two cards');

    it.todo('displays the most recently created list at the top');
  });

  describe('when the group has two lists containing articles', () => {
    it.todo('displays the most recently updated list at the top');
  });
});
