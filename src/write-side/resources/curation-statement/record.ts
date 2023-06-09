import * as E from 'fp-ts/Either';
import { toErrorMessage } from '../../../types/error-message';
import { ResourceAction } from '../resource-action';
import { RecordCurationStatementCommand } from '../../commands/record-curation-statement';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const record: ResourceAction<RecordCurationStatementCommand> = (command) => (events) => E.left(toErrorMessage('not-implemented'));
