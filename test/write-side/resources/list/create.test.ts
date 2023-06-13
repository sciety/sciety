import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { create } from '../../../../src/write-side/resources/list/create';
import { arbitraryString } from '../../../helpers';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';
import { EventOfType, constructEvent, isEventOfType } from '../../../../src/domain-events';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('create', () => {
  const listId = arbitraryListId();
  const ownerId = arbitraryListOwnerId();
  const name = arbitraryString();
  const description = arbitraryString();

  describe('when a command is received', () => {
    const result: ReadonlyArray<EventOfType<'ListCreated'>> = pipe(
      [],
      create({
        listId,
        ownerId,
        name,
        description,
      }),
      E.getOrElseW(shouldNotBeCalled),
      RA.filter(isEventOfType('ListCreated')),
    );

    it('returns a ListCreated event', () => {
      expect(result).toHaveLength(1);
      expect(isEventOfType('ListCreated')(result[0])).toBe(true);
    });

    it('returns a ListCreated event with the specified listId', () => {
      expect(result[0].listId).toStrictEqual(listId);
    });

    it('returns a ListCreated event containing the requested owner', () => {
      expect(result[0].ownerId).toStrictEqual(ownerId);
    });

    it('returns a ListCreated event containing the requested name', () => {
      expect(result[0].name).toStrictEqual(name);
    });

    it('returns a ListCreated event containing the requested description', () => {
      expect(result[0].description).toStrictEqual(description);
    });
  });

  describe('when a command is received for an already existing listId', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: arbitraryListOwnerId(),
        }),
      ],
      create({
        listId,
        ownerId,
        name,
        description,
      }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('does not return an event', () => {
      expect(result).toHaveLength(0);
    });
  });
});
