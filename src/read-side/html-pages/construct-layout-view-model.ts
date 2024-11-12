import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { PageLayoutViewModel } from './page-layout-view-model';
import { UserId } from '../../types/user-id';
import { DependenciesForViews } from '../dependencies-for-views';

export type Dependencies = DependenciesForViews;

const constructLoggedInUserDetails = (dependencies: Dependencies, loggedInUserId: O.Option<UserId>) => pipe(
  loggedInUserId,
  O.chain((id) => dependencies.lookupUser(id)),
);

export const constructLayoutViewModel = (
  dependencies: Dependencies,
  loggedInUserId: O.Option<UserId>,
): PageLayoutViewModel => {
  const user = constructLoggedInUserDetails(dependencies, loggedInUserId);
  return ({
    userDetails: user,
  });
};
