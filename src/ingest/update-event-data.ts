import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupIngestionConfigurations } from './group-ingestion-configurations';
import { GroupIngestionConfiguration, updateAll } from './update-all';
import { Environment, validateEnvironment } from './validate-environment';

const shouldUpdate = (pattern: Environment['ingestOnly']) => (group: GroupIngestionConfiguration) => {
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

const selectGroupsToIngest = (environment: Environment) => pipe(
  environment,
  groupIngestionConfigurations,
  RA.filter(shouldUpdate(environment.ingestOnly)),
  RA.filter(shouldNotExclude),
);

void (async (): Promise<unknown> => pipe(
  process.env,
  validateEnvironment,
  TE.fromEither,
  TE.chain((environment) => updateAll(environment, selectGroupsToIngest(environment))),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
