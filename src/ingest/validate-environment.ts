import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';

export type Environment = {
  targetApp: string,
  bearerToken: string,
  ingestDays: number,
  preReviewBearerToken: string,
  crossrefApiBearerToken: string,
  prelightsFeedKey: string,
  ingestOnly: string | undefined,
  ingestExcept: string | undefined,
  ingestDebug: boolean,
  experimentEnabled: boolean,
};

const environmentCodec = t.strict({
  INGESTION_TARGET_APP: tt.NonEmptyString,
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
  INGEST_DAYS: tt.withFallback(tt.NumberFromString, 5),
  PREREVIEW_BEARER_TOKEN: tt.NonEmptyString,
  CROSSREF_API_BEARER_TOKEN: tt.NonEmptyString,
  PRELIGHTS_FEED_KEY: tt.NonEmptyString,
  INGEST_ONLY: t.union([t.string, t.undefined]),
  INGEST_EXCEPT: t.union([t.string, t.undefined]),
  INGEST_DEBUG: t.union([t.string, t.undefined]),
  EXPERIMENT_ENABLED: t.string,
});

export const validateEnvironment = (env: unknown): E.Either<void, Environment> => pipe(
  env,
  environmentCodec.decode,
  E.mapLeft((errors) => {
    process.stderr.write(`Incorrect environment configuration: ${formatValidationErrors(errors).join('\n')}\n`);
  }),
  E.map((environment) => ({
    targetApp: environment.INGESTION_TARGET_APP,
    bearerToken: environment.SCIETY_TEAM_API_BEARER_TOKEN,
    ingestDays: environment.INGEST_DAYS,
    preReviewBearerToken: environment.PREREVIEW_BEARER_TOKEN,
    crossrefApiBearerToken: environment.CROSSREF_API_BEARER_TOKEN,
    prelightsFeedKey: environment.PRELIGHTS_FEED_KEY,
    ingestOnly: environment.INGEST_ONLY,
    ingestExcept: environment.INGEST_EXCEPT,
    ingestDebug: environment.INGEST_DEBUG !== undefined && environment.INGEST_DEBUG.length > 0,
    experimentEnabled: environment.EXPERIMENT_ENABLED === 'true',
  })),
);
