import { Participant } from './docmap-type';

// ts-unused-exports:disable-next-line
export const anonymous = 'anonymous';

export const anonymousReviewer: Participant = {
  actor: {
    name: anonymous,
    type: 'person',
  },
  role: 'peer-reviewer',
};
