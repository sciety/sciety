import * as TE from 'fp-ts/TaskEither';
import { Dependencies } from '../../discover-published-evaluations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const retrieveActionDoiFromDocmap = (dependencies: Dependencies) => (docmapUri: string): TE.TaskEither<string, string> => TE.right('');
