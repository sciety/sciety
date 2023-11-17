import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists } from './data.js';
import * as Lid from '../../types/list-id.js';
import { SubjectArea } from '../../types/subject-area.js';

export const getCorrespondingListId = (subjectArea: SubjectArea): O.Option<Lid.ListId> => pipe(
  mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists,
  R.lookup(subjectArea.value),
  O.map(Lid.fromValidatedString),
);
