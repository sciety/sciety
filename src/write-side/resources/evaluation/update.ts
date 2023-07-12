import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';
import { constructEvent, isEventOfType } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  RA.filter(isEventOfType('EvaluationRecorded')),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.match(
    () => E.left(toErrorMessage('no recorded evaluation found')),
    (es) => E.right(es),
  ),
  E.map((events) => pipe(
    events,
    RA.filter((e) => e.evaluationType !== command.evaluationType),
    RA.isNonEmpty,
    B.fold(
      () => [],
      () => [
        constructEvent('EvaluationUpdated')({
          evaluationLocator: command.evaluationLocator,
          evaluationType: command.evaluationType,
        }),
      ],
    ),
  )),
);
