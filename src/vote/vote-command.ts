type VoteCommand = () => Promise<void>;
export type CommitEvents = (events: []) => void;

export default (commitEvents: CommitEvents): VoteCommand => async () => {
  commitEvents([]);
};
