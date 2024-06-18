import { ViewModel } from './view-model';
import { Queries } from '../../../../read-models';

export const constructViewModel = (queries: Queries): ViewModel => queries.getAllGroups();
