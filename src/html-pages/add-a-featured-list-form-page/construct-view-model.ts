import * as E from 'fp-ts/Either';

export type ViewModel = {
  groupName: string,
};

export const constructViewModel = (): E.Either<'no-such-group', ViewModel> => E.right({
  groupName: 'Group',
});
