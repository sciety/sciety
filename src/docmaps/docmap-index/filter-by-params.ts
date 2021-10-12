import { DocmapIndexEntryModel } from './docmap-index-entry-models';

type FilterByParams = (
  query: string
) => (entries: ReadonlyArray<DocmapIndexEntryModel>) => ReadonlyArray<DocmapIndexEntryModel>;

// ts-unused-exports:disable-next-line
export const filterByParams: FilterByParams = () => (entries) => entries;
