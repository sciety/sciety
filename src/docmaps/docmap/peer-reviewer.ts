import { Participant } from './docmap-type';

export const anonymous = 'anonymous';

export const peerReviewer = (name: string): Participant => ({
  actor: {
    name,
    type: 'person',
  },
  role: 'peer-reviewer',
});
