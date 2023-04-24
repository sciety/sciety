import { SharedPorts } from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { Queries } from '../shared-read-models/dispatcher';

export type CollectedPorts = SharedPorts & Queries & {
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
};
