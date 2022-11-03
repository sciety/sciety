import * as IO from 'fp-ts/IO';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  handleEvent,
  initialState,
  ReadModel,
} from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  readModel: IO.IO<ReadModel>,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let readModel = initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModel = RA.reduce(readModel, handleEvent)(events);
  };

  return {
    readModel: IO.of(readModel),
    dispatchToAllReadModels,
  };
};
