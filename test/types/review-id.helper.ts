import { Doi } from '../../src/types/doi';
import { ReviewId } from '../../src/types/review-id';
import { arbitraryWord } from '../helpers';

export const arbitraryReviewId = (): ReviewId => new Doi(`10.1101/${arbitraryWord(8)}`);
