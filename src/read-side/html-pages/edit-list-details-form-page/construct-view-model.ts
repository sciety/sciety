import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './render-edit-list-details-form-page';
import { Queries } from '../../../read-models';
import * as DE from '../../../types/data-error';
import { ListId } from '../../../types/list-id';
import { listDescriptionMaxLength, listNameMaxLength } from '../../../write-side/commands/edit-list-details';

export type Dependencies = {
  lookupList: Queries['lookupList'],
};

type ConstructViewModel = (dependencies: Dependencies) => (id: ListId) => E.Either<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (id) => pipe(
  id,
  dependencies.lookupList,
  E.fromOption(() => DE.notFound),
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
