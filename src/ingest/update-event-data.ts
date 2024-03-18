import * as RA from 'fp-ts/ReadonlyArray';
import * as tt from 'io-ts-types';
import * as t from 'io-ts';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { groupIngestionConfigurations } from './group-ingestion-configurations';
import { GroupIngestionConfiguration, updateAll } from './update-all';

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
});

const validateEnvironment = (env: unknown) => pipe(
  env,
  environmentCodec.decode,
  E.mapLeft((errors) => {
    process.stderr.write(`Incorrect environment configuration: ${formatValidationErrors(errors).join('\n')}\n`);
  }),
  E.map((environment) => ({
    targetApp: environment.INGESTION_TARGET_APP,
    bearerToken: environment.SCIETY_TEAM_API_BEARER_TOKEN,
  })),
);

void (async (): Promise<unknown> => pipe(
  process.env,
  validateEnvironment,
  E.map((environment) => ({
    ...environment,
    groupsToIngest: pipe(
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
