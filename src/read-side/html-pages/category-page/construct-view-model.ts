import { Params } from './params';
import { ViewModel } from './view-model';

export const constructViewModel = (params: Params): ViewModel => ({
  pageHeading: `${params.title}`,
  categoryContent: undefined,
});
