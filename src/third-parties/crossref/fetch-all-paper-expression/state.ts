import { CrossrefWork } from './crossref-work';

export type State = {
  queue: ReadonlyArray<string>,
  collectedWorks: Map<string, CrossrefWork>,
};
