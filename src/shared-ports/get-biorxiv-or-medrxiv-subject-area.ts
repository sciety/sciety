import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { SubjectArea } from '../types/subject-area';

export type GetBiorxivOrMedrxivSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, SubjectArea>;
