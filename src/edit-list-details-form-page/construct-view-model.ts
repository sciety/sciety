import { ViewModel } from './render-edit-list-details-form-page';
import { GetList } from '../shared-ports';
import { ListId } from '../types/list-id';

export type Ports = {
  getList: GetList,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (adapters: Ports) => (id: ListId): ViewModel => ({
  name: '',
  id,
});
