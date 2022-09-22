import * as E from 'fp-ts/Either';
import { descriptionPathCodec } from '../../src/add-group/description-path-codec';
import { arbitraryWord } from '../helpers';

describe('description-path-codec', () => {
  describe('that is a single file name with a markdown file extension', () => {
    const descriptionPath = descriptionPathCodec.decode(`${arbitraryWord()}.md`);

    it('is valid', () => {
      expect(E.isRight(descriptionPath)).toBe(true);
    });
  });

  describe('that contains a folder', () => {
    const descriptionPath = descriptionPathCodec.decode(`/${arbitraryWord()}/${arbitraryWord()}.md`);

    it('is not valid', () => {
      expect(E.isLeft(descriptionPath)).toBe(true);
    });
  });

  describe('that does not have a markdown file extension', () => {
    it.todo('is not valid');
  });
});
