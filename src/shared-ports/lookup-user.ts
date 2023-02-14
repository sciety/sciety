import * as O from 'fp-ts/Option';
import { UserDetails } from '../types/user-details';
import { CandidateUserHandle } from '../types/candidate-user-handle';

export type LookupUser = (handle: CandidateUserHandle) => O.Option<UserDetails>;
