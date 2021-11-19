import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import {
  groupCreated, groupEvaluatedArticle, userFollowedEditorialCommunity, userSavedArticle,
} from '../../src/domain-events';
import { getGroup, getGroupBySlug } from '../../src/shared-read-models/all-groups';
import * as DE from '../../src/types/data-error';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const group = arbitraryGroup();

const arbitraryUninterestingEvents = [
  groupCreated(arbitraryGroup()),
  userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
  groupEvaluatedArticle(group.id, arbitraryDoi(), arbitraryReviewId()),
  userSavedArticle(arbitraryUserId(), arbitraryDoi()),
];

describe('all-groups', () => {
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

      it.skip('returns the group', () => {
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

  describe('allGroups', () => {
    describe('when no groups have been promoted', () => {
      it.todo('returns the groups in arbitrary order');
    });

    describe('when some groups have been promoted', () => {
      it.todo('returns the promoted groups at the top of the list');
    });
  });
});
