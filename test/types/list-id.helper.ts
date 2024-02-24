import * as Lid from '../../src/types/list-id.js';
import { arbitraryWord } from '../helpers.js';

export const arbitraryListId = (): Lid.ListId => Lid.fromValidatedString(`list-id-${arbitraryWord(6)}`);
