import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { groupCreated } from '../../../src/domain-events';
import { getGroup } from '../../../src/shared-read-models/groups';
import * as DE from '../../../src/types/data-error';
import { arbitraryGroup } from '../../types/group.helper';

const group = arbitraryGroup();

describe('getGroup', () => {
  describe('when the group exists', () => {
    const result = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupCreated(group),
        ...arbitraryUninterestingEvents,
      ],
      getGroup(group.id),
    );

    it('returns the group', () => {
      expect(result).toStrictEqual(E.right(group));
    });
  });

  describe('when the group does not exist', () => {
    const result = pipe(
      [
        ...arbitraryUninterestingEvents,
      ],
      getGroup(group.id),
    );

    it('returns not-found', () => {
      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
