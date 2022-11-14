import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  addArticleToElifeSubjectAreaListReadModel: addArticleToElifeSubjectAreaList.ReadModel,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
  };

  return {
    addArticleToElifeSubjectAreaListReadModel,
    dispatchToAllReadModels,
  };
};
