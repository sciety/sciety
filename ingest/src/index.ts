import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluationDiscoveryProcesses } from './evaluation-discovery-processes';
import { Configuration, generateConfigurationFromEnvironment } from './generate-configuration-from-environment';
import { EvaluationDiscoveryProcess, updateAll } from './update-all';

const shouldUpdate = (pattern: Configuration['ingestOnly']) => (group: EvaluationDiscoveryProcess) => {
  if (pattern) {
    return group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.groupId.toLowerCase().includes(pattern.toLowerCase());
  }
  return true;
};

const shouldNotExclude = (pattern: Configuration['ingestExcept']) => (group: EvaluationDiscoveryProcess) => {
  if (pattern) {
    return !(group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.groupId.toLowerCase().includes(pattern.toLowerCase()));
  }
  return true;
};

const selectGroupsToIngest = (environment: Configuration) => pipe(
  environment,
  evaluationDiscoveryProcesses,
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
