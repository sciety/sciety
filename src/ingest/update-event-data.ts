import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { groupIngestionConfigurations } from './group-ingestion-configurations';
import { Config, GroupIngestionConfiguration, updateAll } from './update-all';

const shouldUpdate = (group: GroupIngestionConfiguration) => {
  const pattern = process.env.INGEST_ONLY;
  if (pattern) {
    return group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.id.toLowerCase().includes(pattern.toLowerCase());
  }
  return true;
};

const shouldNotExclude = (group: GroupIngestionConfiguration) => {
  const pattern = process.env.INGEST_EXCEPT;
  if (pattern) {
    return !(group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.id.toLowerCase().includes(pattern.toLowerCase()));
  }
  return true;
};

const environmentCodec = t.strict({
  INGESTION_TARGET_APP: tt.NonEmptyString,
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
  INGEST_DAYS: tt.withFallback(tt.NumberFromString, 5),
  PREREVIEW_BEARER_TOKEN: tt.withFallback(t.string, 'bogus-prereview-bearer-token'),
});

const validateEnvironment = (env: unknown): E.Either<void, Omit<Config, 'groupsToIngest'>> => pipe(
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

void (async (): Promise<unknown> => pipe(
  process.env,
  validateEnvironment,
  E.map((environment) => ({
    ...environment,
    groupsToIngest: pipe(
      environment.preReviewBearerToken,
      groupIngestionConfigurations,
      RA.filter(shouldUpdate),
      RA.filter(shouldNotExclude),
    ),
  })),
  TE.fromEither,
  TE.chain(updateAll),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
