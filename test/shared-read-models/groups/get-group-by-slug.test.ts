import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { groupCreated } from '../../../src/domain-events';
import { getGroupBySlug } from '../../../src/shared-read-models/groups';
import * as DE from '../../../src/types/data-error';
import { arbitraryGroup } from '../../types/group.helper';

const group = arbitraryGroup();

describe('getGroupBySlug', () => {
  describe('when the group exists', () => {
    const result = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupCreated(group),
        ...arbitraryUninterestingEvents,
      ],
      getGroupBySlug(group.slug),
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
      getGroupBySlug(group.id),
    );

    it('returns not-found', () => {
      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
