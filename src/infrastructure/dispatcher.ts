import * as RA from 'fp-ts/ReadonlyArray';
import { DomainEvent } from '../domain-events';
import {
  handleEvent,
  initialState,
  MissingArticles,
} from '../shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  readModel: MissingArticles,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let readModel = initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModel = RA.reduce(readModel, handleEvent)(events);
  };

  return {
    readModel,
    dispatchToAllReadModels,
  };
};
