import * as RA from 'fp-ts/ReadonlyArray';
import { toListCardViewModel } from '../lists/to-list-card-view-model';

export const toOurListsViewModel = RA.map(toListCardViewModel);
