import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as listsContent from '../shared-read-models/lists-content';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  addArticleToElifeSubjectAreaListReadModel: addArticleToElifeSubjectAreaList.ReadModel,
  listsContentReadModel: listsContent.ReadModel,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  let listsContentReadModel = listsContent.initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    listsContentReadModel = RA.reduce(
      listsContentReadModel,
      listsContent.handleEvent,
    )(events);
  };

  return {
    addArticleToElifeSubjectAreaListReadModel,
    listsContentReadModel,
    dispatchToAllReadModels,
  };
};
