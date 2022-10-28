import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists } from './data';
import * as Lid from '../../types/list-id';

export const getCorrespondingListId = (subjectArea: string): O.Option<Lid.ListId> => pipe(
  mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists,
  R.lookup(subjectArea),
  O.map(Lid.fromValidatedString),
);
