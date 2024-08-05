import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { processServer } from '../../../../src/ingest/third-parties/hypothesis/process-server';
import { arbitraryDate, arbitraryWord } from '../../../helpers';

const arbitraryAnnotation = () => ({
  id: arbitraryWord(),
  created: arbitraryWord(),
  uri: arbitraryWord(),
  text: arbitraryWord(),
  tags: [arbitraryWord()],
});

const populatedPage = TE.right({
  rows: [arbitraryAnnotation(), arbitraryAnnotation()],
});

const emptyPage = TE.right({
  rows: [],
});

describe('process-server', () => {
  describe('when there is one page of annotations', () => {
    it('returns the annotations from that page', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(populatedPage)
        .mockReturnValueOnce(emptyPage);
      const result = await processServer(arbitraryWord(), arbitraryDate(), fetchData)();

      expect(pipe(
        result,
        E.map((items) => items.length),
      )).toStrictEqual(E.right(2));
    });
  });

  describe('when there are no annotations', () => {
    it('returns an empty array', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(emptyPage);
      const result = await processServer(arbitraryWord(), arbitraryDate(), fetchData)();

      expect(result).toStrictEqual(E.right([]));
    });
  });

  describe('when the first page of annotations cannot be fetched', () => {
    it('returns an error', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(TE.left('bad thing occurred'));
      const result = await processServer(arbitraryWord(), arbitraryDate(), fetchData)();

      expect(result).toStrictEqual(E.left('bad thing occurred'));
    });
  });

  describe('when the second page of annotations cannot be fetched', () => {
    it('returns an error', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(populatedPage)
        .mockReturnValueOnce(TE.left('bad thing occurred'));
      const result = await processServer(arbitraryWord(), arbitraryDate(), fetchData)();

      expect(result).toStrictEqual(E.left('bad thing occurred'));
    });
  });

  describe('when a response from Hypothesis is corrupt', () => {
    it.each([
      [{}],
      [{ rows: 25 }],
      [{ rows: [{}] }],
      [{ rows: [{ id: arbitraryWord() }] }],
    ])('returns an error', async (response) => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(TE.right(response));
      const result = await processServer(arbitraryWord(), arbitraryDate(), fetchData)();

      expect(E.isLeft(result)).toBe(true);
    });
  });
});
