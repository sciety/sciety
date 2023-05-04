import {
  $, click, currentURL, goto, openBrowser,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryEvaluationLocator } from '../test/types/evaluation-locator.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryGroup } from '../test/types/group.helper';

describe('respond', () => {
  const groupA = arbitraryGroup();

  beforeAll(async () => {
    await callApi('api/add-group', {
      ...groupA,
      groupId: groupA.id,
    });
    await callApi('api/record-evaluation', {
      groupId: groupA.id,
      publishedAt: new Date(),
      evaluationLocator: arbitraryEvaluationLocator(),
      articleId: 'doi:10.1101/2020.07.13.199174',
      authors: [],
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('after clicking on the thumbs down button for an evaluation', () => {
      beforeEach(async () => {
        await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
        await click($('.activity-feed__item:first-child button[value="respond-not-helpful"]'));
      });

      it('returns to the review fragment on the article page', async () => {
        const result = await currentURL();

        expect(result).toContain('10.1101/2020.07.13.199174');
        expect(result).toMatch(/.*#[a-z]*:/);
      });
    });
  });
});
