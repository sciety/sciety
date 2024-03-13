import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { getGroupBySlug } from '../../../src/read-models/groups/get-group-by-slug';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryString } from '../../helpers';

const group = arbitraryGroup();

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

    it('returns the group', () => {
      expect(getGroupBySlug(readmodel)(groupJoinedEvent.slug)).toStrictEqual(O.some(expect.objectContaining({
        slug: groupJoinedEvent.slug,
      })));
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

    it('returns the group', () => {
      expect(getGroupBySlug(readmodel)(groupJoinedEvent.slug)).toStrictEqual(O.some(expect.objectContaining({
        slug: groupJoinedEvent.slug,
      })));
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
      expect(getGroupBySlug(readmodel)(group.id)).toStrictEqual(O.none);
    });
  });
});
