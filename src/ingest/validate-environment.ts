import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { Config } from './update-all';

const environmentCodec = t.strict({
  INGESTION_TARGET_APP: tt.NonEmptyString,
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
  INGEST_DAYS: tt.withFallback(tt.NumberFromString, 5),
  PREREVIEW_BEARER_TOKEN: tt.NonEmptyString,
});

export const validateEnvironment = (env: unknown): E.Either<void, Omit<Config, 'groupsToIngest'>> => pipe(
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
  })),
);
