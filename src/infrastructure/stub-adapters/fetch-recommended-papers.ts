import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../../third-parties/index.js';
import * as EDOI from '../../types/expression-doi.js';

const hardcodedResponse = [
  EDOI.fromValidatedString('10.1101/2023.03.24.534097'),
  EDOI.fromValidatedString('10.1101/2023.03.21.533689'),
];

export const fetchRecommendedPapers: ExternalQueries['fetchRecommendedPapers'] = () => TE.right(hardcodedResponse);
