import { formatValidationErrors } from 'io-ts-reporters';
import * as t from 'io-ts';
import { Logger } from '../../../shared-ports';

export const logCodecFailure = (logger: Logger, doi: string, source: string) => (errors: t.Errors): t.Errors => {
  logger('error', `${source} crossref codec failed`, {
    doi,
    errors: formatValidationErrors(errors),
  });
  return errors;
};
