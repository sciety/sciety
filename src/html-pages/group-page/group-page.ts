import { TabIndex } from './content-model';

export { paramsCodec } from './construct-view-model/construct-view-model';

export const groupPageTabs: Record<string, TabIndex> = {
  lists: 0,
  about: 1,
  followers: 2,
};
