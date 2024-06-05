import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Configuration, generateConfigurationFromEnvironment } from './generate-configuration-from-environment';
import { groupIngestionConfigurations } from './group-ingestion-configurations';
import { GroupIngestionConfiguration, updateAll } from './update-all';

const shouldUpdate = (pattern: Configuration['ingestOnly']) => (group: GroupIngestionConfiguration) => {
  if (pattern) {
    return group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.id.toLowerCase().includes(pattern.toLowerCase());
  }
  return true;
};

const shouldNotExclude = (pattern: Configuration['ingestExcept']) => (group: GroupIngestionConfiguration) => {
  if (pattern) {
    return !(group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.id.toLowerCase().includes(pattern.toLowerCase()));
  }
  return true;
};

const selectGroupsToIngest = (environment: Configuration) => pipe(
  environment,
  groupIngestionConfigurations,
  RA.filter(shouldUpdate(environment.ingestOnly)),
  RA.filter(shouldNotExclude(environment.ingestExcept)),
);

void (async (): Promise<unknown> => pipe(
  process.env,
  generateConfigurationFromEnvironment,
  TE.fromEither,
  TE.chain((environment) => updateAll(environment, selectGroupsToIngest(environment))),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
