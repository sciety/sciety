import { AcmiJats } from '../../../src/third-parties/access-microbiology/acmi-jats';
import { getEvaluationFullText } from '../../../src/third-parties/access-microbiology/get-evaluation-full-text';
import { arbitraryString } from '../../helpers';

describe('get-evaluation-full-text', () => {
  describe.skip('given a JATS article containing the relevant sub-article', () => {
    const html = arbitraryString();
    const acmiJats: AcmiJats = {
      article: {
        'sub-article': [
          {
            'front-stub': { 'article-id': '10.1099/acmi.0.000569.v1.1' },
            body: 'not specified yet, unknown shape',
          },
          {
            'front-stub': { 'article-id': '10.1099/acmi.0.000569.v1.2' },
            body: 'not specified yet, unknown shape',
          },
          {
            'front-stub': { 'article-id': '10.1099/acmi.0.000569.v1.3' },
            body: 'not specified yet, unknown shape',
          },
          {
            'front-stub': { 'article-id': '10.1099/acmi.0.000569.v1.4' },
            body: 'not specified yet, unknown shape',
          },
        ],
      },
    };
    const result = getEvaluationFullText(acmiJats);

    it('returns the body as sanitised HTML', () => {
      expect(result).toStrictEqual(html);
    });
  });
});
