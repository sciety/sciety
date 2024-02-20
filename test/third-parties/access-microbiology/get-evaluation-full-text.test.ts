import { AcmiJats } from '../../../src/third-parties/access-microbiology/acmi-jats';
import { getEvaluationFullText } from '../../../src/third-parties/access-microbiology/get-evaluation-full-text';
import { arbitraryString } from '../../helpers';

describe('get-evaluation-full-text', () => {
  describe.skip('given a JATS article containing the relevant sub-article', () => {
    const html = arbitraryString();
    const subArticleId = '10.1099/acmi.0.000569.v1.4';
    const acmiJats: AcmiJats = {
      article: {
        'sub-article': [
          {
            'front-stub': { 'article-id': arbitraryString() },
            body: 'not specified yet, unknown shape',
          },
          {
            'front-stub': { 'article-id': arbitraryString() },
            body: 'not specified yet, unknown shape',
          },
          {
            'front-stub': { 'article-id': arbitraryString() },
            body: 'not specified yet, unknown shape',
          },
          {
            'front-stub': { 'article-id': subArticleId },
            body: 'not specified yet, unknown shape',
          },
        ],
      },
    };
    const result = getEvaluationFullText(subArticleId)(acmiJats);

    it('returns the body as sanitised HTML', () => {
      expect(result).toStrictEqual(html);
    });
  });
});
