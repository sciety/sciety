import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { inMemoryGroupRepository } from '../../src/infrastructure/in-memory-groups';
import * as DE from '../../src/types/data-error';
import { Group } from '../../src/types/group';
import { GroupRepository } from '../../src/types/group-repository';
import { arbitraryWord } from '../helpers';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';

describe('all-groups', () => {
  let repository: GroupRepository;
  const group = arbitraryGroup();
  let result: E.Either<DE.DataError, Group>;

  beforeEach(async () => {
    repository = inMemoryGroupRepository([group]);
  });

  describe('getGroup', () => {
    describe('when the group exists', () => {
      beforeEach(async () => {
        result = await pipe(
          group.id,
          repository.lookup,
        )();
      });

      it('returns the group', () => {
        expect(result).toStrictEqual(E.right(group));
      });
    });

    describe('when the group does not exist', () => {
      beforeEach(async () => {
        result = await pipe(
          arbitraryGroupId(),
          repository.lookup,
        )();
      });

      it('returns not-found', () => {
        expect(result).toStrictEqual(E.left(DE.notFound));
      });
    });
  });

  describe('getGroupBySlug', () => {
    describe('when the group exists', () => {
      beforeEach(async () => {
        result = await pipe(
          group.slug,
          repository.lookupBySlug,
        )();
      });

      it('returns the group', () => {
        expect(result).toStrictEqual(E.right(group));
      });
    });

    describe('when the group does not exist', () => {
      beforeEach(async () => {
        result = await pipe(
          arbitraryWord(),
          repository.lookupBySlug,
        )();
      });

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
