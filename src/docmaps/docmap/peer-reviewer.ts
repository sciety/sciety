import { Participant } from './docmap-type.js';

export const anonymous = 'anonymous';

export const peerReviewer = (name: string): Participant => ({
  actor: {
    name,
    type: 'person',
  },
  role: 'peer-reviewer',
});
