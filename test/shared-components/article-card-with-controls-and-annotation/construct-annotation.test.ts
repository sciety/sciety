import * as O from 'fp-ts/Option';

import { createTestFramework } from '../../framework';
import {
  constructAnnotation,
} from '../../../src/shared-components/article-card-with-controls-and-annotation/construct-annotation';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('construct-annotation', () => {
  describe('when there is no annotation', () => {
    it('returns none', () => {
      const framework = createTestFramework();
      const result = constructAnnotation(framework.dependenciesForViews)(arbitraryListId(), arbitraryArticleId());

      expect(result).toStrictEqual(O.none);
    });
  });

  describe('when there is an annotation', () => {
    it.todo('returns its content');

    it.todo('returns its author');
  });
});
