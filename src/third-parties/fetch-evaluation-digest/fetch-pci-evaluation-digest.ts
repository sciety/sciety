import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import {
  flow, pipe,
} from 'fp-ts/function';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';

const groupAbbreviationPatter = /10.24072\/pci\.([a-z]+)\./;

const extractPciGroupAbbreviation = (key: string) => pipe(
  groupAbbreviationPatter.exec(key),
  E.fromNullable('regex failure'),
  E.chain(
    flow(
      RA.lookup(1),
      E.fromOption(() => 'no first capture group in regex match'),
    ),
  ),
);

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
