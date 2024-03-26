import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { getGroupBySlug } from '../../../src/read-models/groups/get-group-by-slug';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('getGroupBySlug', () => {
  describe('when the group joined without a large logo', () => {
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    const readmodel = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupJoinedEvent,
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      groupJoinedEvent.slug,
      getGroupBySlug(readmodel),
      O.getOrElseW(shouldNotBeCalled),
    );

    it('returns the group', () => {
      expect(result.slug).toBe(groupJoinedEvent.slug);
    });
  });

  describe('when the group joined with a large logo', () => {
    const groupJoinedEvent = {
      ...arbitraryGroupJoinedEvent(),
      largeLogoPath: arbitraryString(),
    };
    const readmodel = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupJoinedEvent,
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      groupJoinedEvent.slug,
      getGroupBySlug(readmodel),
      O.getOrElseW(shouldNotBeCalled),
    );

    it('returns the group', () => {
      expect(result.slug).toBe(groupJoinedEvent.slug);
    });
  });

  describe('when the group does not exist', () => {
    const readmodel = pipe(
      [
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns not-found', () => {
      expect(getGroupBySlug(readmodel)(arbitraryGroupId())).toStrictEqual(O.none);
    });
  });
});
