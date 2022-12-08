import { ViewModel } from './render-edit-list-details-form-page';
import { ListId } from '../types/list-id';

export const constructViewModel = (id: ListId): ViewModel => ({
  name: '',
  id,
});
