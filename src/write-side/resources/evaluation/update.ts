import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';
import { constructEvent, isEventOfType } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('EvaluationRecorded')),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.isNonEmpty,
  B.fold(
    () => E.left(toErrorMessage('no recorded evaluation found')),
    () => E.right([
      constructEvent('EvaluationUpdated')({
        evaluationLocator: command.evaluationLocator,
        evaluationType: command.evaluationType,
      }),
    ]),
  ),
);
