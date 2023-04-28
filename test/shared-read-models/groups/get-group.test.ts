import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { groupJoined } from '../../../src/domain-events';
import { getGroup, handleEvent, initialState } from '../../../src/shared-read-models/groups';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';

const group = arbitraryGroup();

describe('getGroup', () => {
  describe('when the group has joined', () => {
    const readModel = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupJoined(
          group.id,
          group.name,
          group.avatarPath,
          group.descriptionPath,
          group.shortDescription,
          group.homepage,
          group.slug,
        ),
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the group', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(group));
    });
  });

  describe('when the group has not joined', () => {
    const readModel = pipe(
      [
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns none', () => {
      expect(getGroup(readModel)(arbitraryGroupId())).toStrictEqual(O.none);
    });
  });
});
