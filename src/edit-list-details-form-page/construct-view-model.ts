import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './render-edit-list-details-form-page';
import { GetList } from '../shared-ports';
import { ListId } from '../types/list-id';

export type Ports = {
  getList: GetList,
};

export const constructViewModel = (adapters: Ports) => (id: ListId): E.Either<unknown, ViewModel> => pipe(
  id,
  adapters.getList,
  E.fromOption(() => ''),
  E.map((list) => ({
    name: list.name,
    id,
    description: list.description,
  })),
);
