import * as T from 'fp-ts/Task';
import { hardcodedDocmap } from './hardcoded-docmap';
import { hardcodedReviewCommonsArticle } from '../../src/docmaps/hardcoded-response';
import * as GroupId from '../../src/types/group-id';
import { arbitraryDate } from '../helpers';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('docmap-generation', () => {
  it('matches the hardcoded structure', async () => {
    const ports = {
      findReviewsForArticleDoi: () => T.of(
        [
          {
            reviewId: arbitraryReviewId(),
            groupId: GroupId.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
            occurredAt: arbitraryDate(),
          },
        ],
      ),
    };
    const docmap = await hardcodedReviewCommonsArticle(ports)('10.1101/2021.04.25.441302')();

    expect(docmap).toStrictEqual(hardcodedDocmap);
  });
});
