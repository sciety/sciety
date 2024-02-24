import { CrossrefWork } from './crossref-work.js';

export type State = {
  queue: ReadonlyArray<string>,
  collectedWorks: Map<string, CrossrefWork>,
};
