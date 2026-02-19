import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { extractPciGroupAbbreviation } from './extract-pci-group-abbreviation';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';

const constructPciWebContentUrl = (
  key: string,
) => (
  abbreviation: string,
) => `https://${abbreviation}.peercommunityin.org/content/doi/${key}`;

export const fetchPciEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key: string) => pipe(
  key,
  extractPciGroupAbbreviation,
  TE.fromEither,
  TE.mapLeft((error) => {
    logger('error', 'failed to extractPciGroupAbbreviation from provided evaluation DOI', { doi: key, error });
    return DE.notFound;
  }),
  TE.map(constructPciWebContentUrl(key)),
  TE.chain(queryExternalService('error')),
  TE.map((html) => sanitise(toHtmlFragment(html as string))),
);
