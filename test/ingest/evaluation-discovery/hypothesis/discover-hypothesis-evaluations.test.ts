import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { discoverHypothesisEvaluations } from '../../../../src/ingest/evaluation-discovery/hypothesis/discover-hypothesis-evaluations';
import { arbitraryDate, arbitraryWord } from '../../../helpers';
import { stubbedFetchData, stubbedFetchDataFailure } from '../fetch-data.helper';

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

describe('discover-hypothesis-evaluations', () => {
  describe('when there is one page of annotations', () => {
    it('returns the annotations from that page', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(populatedPage)
        .mockReturnValueOnce(emptyPage);
      const result = await discoverHypothesisEvaluations(arbitraryWord(), arbitraryDate(), fetchData)();

      expect(pipe(
        result,
        E.map((items) => items.length),
      )).toStrictEqual(E.right(2));
    });
  });

  describe('when there are no annotations', () => {
    it('returns an empty array', async () => {
      // const fetchData = jest.fn()
      //   .mockReturnValueOnce(emptyPage);
      const result = await discoverHypothesisEvaluations(
        arbitraryWord(),
        arbitraryDate(),
        stubbedFetchData({
          rows: [],
        }),
      )();

      expect(result).toStrictEqual(E.right([]));
    });
  });

  describe('when the first page of annotations cannot be fetched', () => {
    const errorResponse = 'bad thing occurred';

    it('returns an error', async () => {
      // const fetchData = jest.fn()
      //   .mockReturnValueOnce(TE.left('bad thing occurred'));
      const result = await discoverHypothesisEvaluations(
        arbitraryWord(),
        arbitraryDate(),
        stubbedFetchDataFailure(errorResponse),
      )();

      expect(result).toStrictEqual(E.left(errorResponse));
    });
  });

  describe('when the second page of annotations cannot be fetched', () => {
    it('returns an error', async () => {
      const fetchData = jest.fn()
        .mockReturnValueOnce(populatedPage)
        .mockReturnValueOnce(TE.left('bad thing occurred'));
      const result = await discoverHypothesisEvaluations(arbitraryWord(), arbitraryDate(), fetchData)();

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
      // const fetchData = jest.fn()
      //   .mockReturnValueOnce(TE.right(response));
      const result = await discoverHypothesisEvaluations(
        arbitraryWord(),
        arbitraryDate(),
        stubbedFetchData(response),
      )();

      expect(E.isLeft(result)).toBe(true);
    });
  });
});
