import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { byMostRecentlyUpdated } from '../../../../read-models/lists';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ApiData } from '../render-as-json';

export const constructViewModel = (dependencies: DependenciesForViews): ApiData => pipe(
  dependencies.getAllUserLists(),
  RA.sort(byMostRecentlyUpdated),
  RA.map((list) => ({
    listId: list.id,
    listName: list.name,
    listOwner: list.ownerId,
    lastUpdated: list.updatedAt,
  })),
  (listsOverview) => ({
    listsCount: dependencies.listsStatusUsersOnly(),
    lists: listsOverview,
  }),
);
