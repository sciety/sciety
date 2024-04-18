import * as E from 'fp-ts/Either';

export type ViewModel = {
  groupName: string,
};

export const constructViewModel = (): E.Either<unknown, ViewModel> => E.right({
  groupName: 'Group',
});
