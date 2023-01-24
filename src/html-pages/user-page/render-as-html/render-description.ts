import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';

const pluralise = (count: number) => (count === 1 ? '' : 's');

export const renderDescription = (viewmodel: ViewModel): string => pipe(
  viewmodel.groupIds.length,
  (groupCount) => `1 list | Following ${groupCount} group${pluralise(groupCount)}`,
);
