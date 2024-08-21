import { getPendingEvaluations, handleEvent, initialState } from './get-pending-evaluations';

export const evaluationsForNotifications = {
  queries: {
    getPendingEvaluations,
  },
  initialState,
  handleEvent,
};
