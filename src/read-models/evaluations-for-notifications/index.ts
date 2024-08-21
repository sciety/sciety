import { getPendingEvaluations, handleEvent, initialState } from './get-pending-evaluations';
import * as GID from '../../types/group-id';

export const evaluationsForNotifications = {
  queries: {
    getPendingEvaluations,
  },
  initialState,
  handleEvent: handleEvent([GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7')]),
};

export { PendingEvaluation } from './get-pending-evaluations';
