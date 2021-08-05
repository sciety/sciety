import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { hardcodedNcrcArticle } from '../../src/docmaps/hardcoded-ncrc-article';
import * as GroupId from '../../src/types/group-id';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('hardcoded-ncrc-article', () => {
  it('includes the article id', async () => {
    const articleId = arbitraryDoi();
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
      getGroup: () => TO.none,
    };
    const docmap = await hardcodedNcrcArticle(ports)(articleId.value)();

    expect(docmap).toStrictEqual(expect.objectContaining({
      id: expect.stringContaining(articleId.value),
    }));
  });
});
