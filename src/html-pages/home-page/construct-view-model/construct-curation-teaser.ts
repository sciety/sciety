import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { Dependencies } from '../dependencies';

export type HardcodedData = Omit<ViewModel['curationTeasers'][number], 'caption'>;

export const constructCurationTeaser = (dependencies: Dependencies) => (hardcodedData: HardcodedData): ViewModel['curationTeasers'][number] => pipe(
  hardcodedData.groupId,
  dependencies.getGroup,
  O.match(
    () => {
      dependencies.logger('error', 'Group missing from readmodel', { groupId: hardcodedData.groupId });
      return 'Curated by unknown';
    },
    (group) => `Curated by ${group.name}`,
  ),
  (caption) => ({
    ...hardcodedData,
    caption,
  }),
);
