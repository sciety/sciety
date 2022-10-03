import { listCreated, ListCreatedEvent } from '../domain-events';
import * as Gid from '../types/group-id';
import * as LID from '../types/list-id';
import * as LOID from '../types/list-owner-id';

export const hardcodedListCreationEvents = (): ReadonlyArray<ListCreatedEvent> => [
  listCreated(
    LID.fromValidatedString('f524583f-ab45-4f07-8b44-6b0767b2d79a'),
    'Evaluated articles',
    'Articles that have been evaluated by ASAPbio-SciELO Preprint crowd review.',
    LOID.fromGroupId(Gid.fromValidatedString('36fbf532-ed07-4573-87fd-b0e22ee49827')),
    new Date('2022-09-29T10:28:14Z'),
  ),
];
