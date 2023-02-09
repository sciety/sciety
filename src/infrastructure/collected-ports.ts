import { SharedPorts } from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';

export type CollectedPorts = SharedPorts & {
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
};
