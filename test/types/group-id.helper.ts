import * as O from 'fp-ts/Option';
import { flow, identity } from 'fp-ts/function';
import { fromString, GroupId } from '../../src/types/group-id';
import { arbitraryWord } from '../helpers';

const fromStringNoOption: (id: string) => GroupId = flow(
  fromString,
  O.fold(
    // eslint-disable-next-line jest/no-jasmine-globals
    () => { throw new Error('not a valid groupId'); },
    identity,
  ),
);

export const arbitraryGroupId = (): GroupId => fromStringNoOption(`group-id-${arbitraryWord(6)}`);

// The prepended group-id here prevents the fromString from returning O.none
export const groupIdFromString = (id: string): GroupId => fromStringNoOption(`group-id-${id}`);
