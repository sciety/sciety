import axios from 'axios';
import dotenv from 'dotenv';
import {
  $, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';
import * as RI from '../src/types/review-id';
import { arbitraryDate, arbitraryString } from '../test/helpers';
import { arbitraryReviewId } from '../test/types/review-id.helper';

describe('record an evaluation', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when a new evaluation is successfully recorded', () => {
    const articleId = '10.1101/2021.07.23.453070';
    const evaluationLocator = RI.serialize(arbitraryReviewId());

    beforeEach(async () => {
      await axios.post(
        'http://localhost:8080/record-evaluation',
        JSON.stringify({
          evaluationLocator,
          articleId,
          groupId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
          publishedAt: arbitraryDate(),
          authors: [arbitraryString(), arbitraryString()],
        }),
        {
          headers: {
            Authorization: 'Bearer secret',
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      );
    });

    it('displays the evaluation', async () => {
      await goto(`localhost:8080/articles/${articleId}`);
      const evaluationIsDisplayed = await $(`[id="${evaluationLocator}"]`).exists();

      expect(evaluationIsDisplayed).toBe(true);
    });
  });
});
