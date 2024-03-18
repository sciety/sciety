import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
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

void (async (): Promise<unknown> => pipe(
  {
    targetApp: process.env.INGESTION_TARGET_APP ?? 'http://app',
    bearerToken: process.env.SCIETY_TEAM_API_BEARER_TOKEN ?? 'secret',
    groupsToIngest: pipe(
      groupIngestionConfigurations,
      RA.filter(shouldUpdate),
      RA.filter(shouldNotExclude),
    ),
  },
  updateAll,
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
