import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupIngestionConfigurations } from './group-ingestion-configurations';
import { GroupIngestionConfiguration, updateAll } from './update-all';
import { fetchReviewsFromHypothesisGroup } from './fetch-reviews-from-hypothesis-group';

const shouldUpdate = (group: GroupIngestionConfiguration) => {
  const pattern = process.env.INGEST_ONLY;
  if (pattern) {
    return group.name.toLowerCase().includes(pattern.toLowerCase())
      || group.id.toLowerCase().includes(pattern.toLowerCase());
  }
  return true;
};

void (async (): Promise<unknown> => pipe(
  groupIngestionConfigurations,
  (groupConfigs) => {
    if (process.env.EXPERIMENT_ENABLED === 'true') {
      return [
        ...groupConfigs,
        {
          id: 'bc1f956b-12e8-4f5c-aadc-70f91347bd18',
          name: 'Arcadia Science',
          fetchFeed: fetchReviewsFromHypothesisGroup('ApM1XL6A', new Date('2023-04-15')),
        },
      ];
    }
    return groupConfigs;
  },
  RA.filter(shouldUpdate),
  updateAll,
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
