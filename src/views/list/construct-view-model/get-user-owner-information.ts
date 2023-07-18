import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../../types/user-id';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';

type OwnerInfo = Pick<ViewModel, 'ownerName'>;

type GetUserOwnerInformation = (dependencies: Dependencies) => (userId: UserId) => O.Option<OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (dependencies) => (userId) => pipe(
  userId,
  dependencies.lookupUser,
  O.map((userDetails) => ({
    ownerName: userDetails.displayName,
  })),
);
