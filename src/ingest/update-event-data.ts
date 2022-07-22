import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { groupIngestionConfigurations } from './group-ingestion-configurations';
import { Group, updateAll } from './update-all';

const shouldUpdate = (group: Group) => {
  const pattern = process.env.INGEST_ONLY;
  if (pattern) {
    return group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.id.toLowerCase().includes(pattern.toLowerCase());
  }
  return true;
};

void (async (): Promise<ReadonlyArray<void>> => pipe(
  groupIngestionConfigurations,
  RA.filter(shouldUpdate),
  updateAll,
)())();
