import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { lists } from '../../../src/group-page/lists/lists';
import { HtmlFragment } from '../../../src/types/html-fragment';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroup } from '../../types/group.helper';

describe('lists', () => {
  describe.skip('when the group owns no lists', () => {
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
});
