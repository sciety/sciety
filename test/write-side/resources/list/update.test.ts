import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { EditListDetailsCommand } from '../../../../src/write-side/commands';
import { update } from '../../../../src/write-side/resources/list';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitrarySanitisedUserInput } from '../../../types/sanitised-user-input.helper';

const arbitraryEditListDetailsCommand = (): EditListDetailsCommand => ({
  listId: arbitraryListId(),
  name: arbitrarySanitisedUserInput(),
  description: arbitrarySanitisedUserInput(),
});

describe.skip('update', () => {
  const command = arbitraryEditListDetailsCommand();
  let result: ReadonlyArray<DomainEvent>;

  describe('given a command', () => {
    beforeEach(() => {
      result = pipe(
        [],
        update(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises exactly two events', () => {
      expect(result).toHaveLength(2);
    });

    it('returns a ListNameEdited event', () => {
      expect(result[0]).toBeDomainEvent('ListNameEdited', {});
    });

    it('returns a ListDescriptionEdited event', () => {
      expect(result[1]).toBeDomainEvent('ListDescriptionEdited', {});
    });
  });
});
