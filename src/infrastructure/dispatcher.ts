import * as RA from 'fp-ts/ReadonlyArray';
import { DomainEvent } from '../domain-events';
import {
  handleEvent,
  initialState,
} from '../shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';

export const dispatcher = () => {
  let readModel = initialState();

  const dispatchToAllReadModels = (es: ReadonlyArray<DomainEvent>) => {
    readModel = RA.reduce(readModel, handleEvent)(es);
  };

  return {
    readModel,
    dispatchToAllReadModels,
  };
};
