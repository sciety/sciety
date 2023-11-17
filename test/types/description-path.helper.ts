import { DescriptionPath } from '../../src/types/description-path.js';
import { arbitraryWord } from '../helpers.js';

export const arbitraryDescriptionPath = (): DescriptionPath => (
  `${arbitraryWord()}.md` as DescriptionPath
);
