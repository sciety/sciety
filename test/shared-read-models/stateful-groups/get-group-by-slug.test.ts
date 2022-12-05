import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { groupJoined } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/stateful-groups';
import { ReadModel } from '../../../src/shared-read-models/stateful-groups/handle-event';
import * as DE from '../../../src/types/data-error';
import { Group } from '../../../src/types/group';
import { arbitraryGroup } from '../../types/group.helper';

type GetGroupBySlug = (slug: string) => E.Either<DE.DataError, Group>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getGroupBySlug = (r: ReadModel): GetGroupBySlug => () => E.left(DE.notFound);

const group = arbitraryGroup();

describe('getGroupBySlug', () => {
  describe('when the group exists', () => {
    const readmodel = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupJoined(group),
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns the group', () => {
      expect(getGroupBySlug(readmodel)(group.slug)).toStrictEqual(E.right(group));
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
      expect(getGroupBySlug(readmodel)(group.id)).toStrictEqual(E.left(DE.notFound));
    });
  });
});
