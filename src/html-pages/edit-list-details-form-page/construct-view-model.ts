import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './render-edit-list-details-form-page';
import { listDescriptionMaxLength, listNameMaxLength } from '../../write-side/commands/edit-list-details';
import { ListId } from '../../types/list-id';
import { Queries } from '../../read-models';

export type Dependencies = {
  lookupList: Queries['lookupList'],
};

export const constructViewModel = (dependencies: Dependencies) => (id: ListId): E.Either<'no-such-list', ViewModel> => pipe(
  id,
  dependencies.lookupList,
  E.fromOption(() => 'no-such-list' as const),
  E.map((list) => ({
    listName: list.name,
    listId: id,
    listHref: `/lists/${id}`,
    listDescription: list.description,
    listNameMaxLength,
    listDescriptionMaxLength,
    pageHeading: 'Edit list details',
  })),
);
