import { v4 } from 'uuid';
import { ReviewId } from '../../src/types/review-id';

export const arbitraryNcrcId = (): ReviewId => (
  `ncrc:${v4()}` as ReviewId
);
