import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../../third-parties';
import * as EDOI from '../../types/expression-doi';

export const fetchByCategory: ExternalQueries['fetchByCategory'] = () => TE.right([
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
]);
