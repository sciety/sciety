import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import {
  EventOfType, constructEvent, DomainEvent, isEventOfType,
} from '../../../domain-events/index.js';
import { ResourceAction } from '../resource-action.js';
import { UpdateEvaluationCommand } from '../../commands/index.js';
import { EvaluationLocator } from '../../../types/evaluation-locator.js';
import { evaluationResourceError } from './evaluation-resource-error.js';
import { EvaluationType } from '../../../types/recorded-evaluation.js';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message.js';

type RelevantEvent = EventOfType<'EvaluationPublicationRecorded'> | EventOfType<'EvaluationUpdated'> | EventOfType<'IncorrectlyRecordedEvaluationErased'> | EventOfType<'EvaluationRemovalRecorded'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => isEventOfType('EvaluationPublicationRecorded')(event)
|| isEventOfType('EvaluationUpdated')(event)
|| isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
|| isEventOfType('EvaluationRemovalRecorded')(event);

type EvaluationAuthors = ReadonlyArray<string>;

const areAuthorsEqual = (
  authorsA: EvaluationAuthors,
  authorsB: EvaluationAuthors,
) => !(RA.getEq(S.Eq).equals(authorsA, authorsB));

const filterToHistoryOf = (evaluationLocator: EvaluationLocator) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
);

type WriteModel = {
  evaluationType: EvaluationType | undefined,
  authors: EvaluationAuthors,
};

type State = E.Either<ErrorMessage, WriteModel>;

const buildEvaluation = (state: State, event: RelevantEvent): State => {
  switch (event.type) {
    case 'EvaluationPublicationRecorded':
      return E.right({
        evaluationType: event.evaluationType,
        authors: event.authors,
      });
    case 'EvaluationUpdated':
      return pipe(
        state,
        E.match(
          () => E.left(toErrorMessage('')),
          (evaluationState) => E.right({
            evaluationType: event.evaluationType ?? evaluationState.evaluationType,
            authors: event.authors ?? evaluationState.authors,
          }),
        ),
      );
    case 'IncorrectlyRecordedEvaluationErased':
      return E.left(evaluationResourceError.doesNotExist);
    case 'EvaluationRemovalRecorded':
      return E.left(evaluationResourceError.previouslyRemovedCannotUpdate);
  }
};

const constructWriteModel = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>): E.Either<ErrorMessage, WriteModel> => pipe(
  events,
  filterToHistoryOf(evaluationLocator),
  RA.reduce(E.left(evaluationResourceError.doesNotExist), buildEvaluation),
);

const calculateAttributesToUpdate = (command: UpdateEvaluationCommand) => (writeModel: WriteModel) => ({
  evaluationType: (command.evaluationType !== undefined
    && command.evaluationType !== writeModel.evaluationType)
    ? command.evaluationType
    : undefined,
  authors: (command.authors !== undefined && areAuthorsEqual(command.authors, writeModel.authors))
    ? command.authors
    : undefined,
});

const hasAnyValues = (attributes: Record<string, unknown | undefined>): boolean => (
  (attributes.evaluationType !== undefined)
  || (attributes.authors !== undefined)
);

const dateField = (command: UpdateEvaluationCommand) => (
  command.issuedAt === undefined
    ? {}
    : { date: command.issuedAt }
);

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  constructWriteModel(command.evaluationLocator),
  E.map(calculateAttributesToUpdate(command)),
  E.map((attributesToChange) => (hasAnyValues(attributesToChange)
    ? [
      constructEvent('EvaluationUpdated')({
        evaluationLocator: command.evaluationLocator,
        ...attributesToChange,
        ...dateField(command),
      }),
    ]
    : [])),
);
