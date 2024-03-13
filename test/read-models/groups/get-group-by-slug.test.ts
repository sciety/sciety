import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { getGroupBySlug } from '../../../src/read-models/groups/get-group-by-slug';
import { arbitraryGroup } from '../../types/group.helper';

const group = arbitraryGroup();

describe('getGroupBySlug', () => {
  describe('when the group joined without a large logo', () => {
    const readmodel = pipe(
      [
        ...arbitraryUninterestingEvents,
        constructEvent('GroupJoined')({
          groupId: group.id,
          name: group.name,
          avatarPath: group.avatarPath,
          descriptionPath: group.descriptionPath,
          shortDescription: group.shortDescription,
          homepage: group.homepage,
          slug: group.slug,
        }),
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the group', () => {
      expect(getGroupBySlug(readmodel)(group.slug)).toStrictEqual(O.some(group));
    });
  });

  describe('when the group joined with a large logo', () => {
    it.todo('returns the group');
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
