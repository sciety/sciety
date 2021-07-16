import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { groupPage } from '../../src/group-page';
import * as DE from '../../src/types/data-error';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('group page', () => {
  describe('when the group does not exist', () => {
    it('returns a notFound error', async () => {
      const result = await pipe(
        {
          id: arbitraryGroupId(),
          user: O.none,
        },
        groupPage({
          fetchStaticFile: shouldNotBeCalled,
          follows: shouldNotBeCalled,
          getAllEvents: shouldNotBeCalled,
          getGroup: () => TO.none,
        }),
        T.map(flow(
          E.matchW(
            (res) => res.type,
            shouldNotBeCalled,
          ),
          DE.isNotFound,
        )),
      )();

      expect(result).toBe(true);
    });
  });
});
