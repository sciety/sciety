import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as listsOwnedByUsers from '../shared-read-models/lists-owned-by-users';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  addArticleToElifeSubjectAreaListReadModel: addArticleToElifeSubjectAreaList.ReadModel,
  listsOwnedByUsersReadModel: listsOwnedByUsers.ReadModel,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  let listsOwnedByUsersReadModel = listsOwnedByUsers.initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    listsOwnedByUsersReadModel = RA.reduce(
      listsOwnedByUsersReadModel,
      listsOwnedByUsers.handleEvent,
    )(events);
  };

  return {
    addArticleToElifeSubjectAreaListReadModel,
    listsOwnedByUsersReadModel,
    dispatchToAllReadModels,
  };
};
