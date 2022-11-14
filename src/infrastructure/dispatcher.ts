import * as RA from 'fp-ts/ReadonlyArray';
import {
  handleEvent,
  initialState,
  ReadModel,
} from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  addArticleToElifeSubjectAreaListReadModel: ReadModel,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      handleEvent,
    )(events);
  };

  return {
    addArticleToElifeSubjectAreaListReadModel,
    dispatchToAllReadModels,
  };
};
