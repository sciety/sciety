import { DescriptionPath } from '../../src/types/description-path';
import { arbitraryWord } from '../helpers';

export const arbitraryDescriptionPath = (): DescriptionPath => (
  `${arbitraryWord()}.md` as DescriptionPath
);
