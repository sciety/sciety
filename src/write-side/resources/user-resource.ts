/* eslint-disable @typescript-eslint/no-unused-vars */
import * as E from 'fp-ts/Either';
import { UserHandle } from '../../types/user-handle';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';

// ts-unused-exports:disable-next-line
export const exists = (userHandle: UserHandle) => (events: ReadonlyArray<DomainEvent>) => E.left(DE.notFound);
