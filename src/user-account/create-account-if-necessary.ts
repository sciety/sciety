import * as T from 'fp-ts/Task';
import { RuntimeGeneratedEvent } from '../domain-events';
import { User } from '../types/user';

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type CreateAccountIfNecessary = (commitEvents: CommitEvents) => (user: User) => void;

export const createAccountIfNecessary: CreateAccountIfNecessary = () => () => {
};
