import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { groupJoined } from '../../../src/domain-events';
import { getGroup } from '../../../src/shared-read-models/groups/get-group';
import { handleEvent, initialState } from '../../../src/shared-read-models/groups/handle-event';
import * as DE from '../../../src/types/data-error';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';

const group = arbitraryGroup();

describe('getGroup', () => {
  describe('when the group exists', () => {
    const readModel = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupJoined(group),
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the group', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(E.right(group));
    });
  });

  describe('when the group does not exist', () => {
    const readModel = pipe(
      [
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns not-found', () => {
      expect(getGroup(readModel)(arbitraryGroupId())).toStrictEqual(E.left(DE.notFound));
    });
  });
});
