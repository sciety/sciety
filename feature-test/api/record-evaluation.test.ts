import {
  $, goto, openBrowser,
} from 'taiko';
import * as RI from '../../src/types/evaluation-locator';
import {
  arbitraryDate, arbitraryString, arbitraryUri, arbitraryWord,
} from '../../test/helpers';
import { arbitraryDescriptionPath } from '../../test/types/description-path.helper';
import { arbitraryEvaluationLocator } from '../../test/types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../test/types/group-id.helper';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';

describe('record an evaluation', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when a new evaluation is successfully recorded', () => {
    const expressionDoi = '10.1101/2021.07.23.453070';
    const evaluationLocator = RI.serialize(arbitraryEvaluationLocator());
    const groupId = arbitraryGroupId();

    beforeEach(async () => {
      await callApi('api/add-group', {
        groupId,
        name: arbitraryString(),
        shortDescription: arbitraryString(),
        homepage: arbitraryString(),
        avatarPath: arbitraryUri(),
        descriptionPath: arbitraryDescriptionPath(),
        slug: arbitraryWord(),
        largeLogoPath: arbitraryString(),
      });
      await callApi('api/record-evaluation-publication', {
        evaluationLocator,
        expressionDoi,
        groupId,
        publishedAt: arbitraryDate(),
        authors: [arbitraryString(), arbitraryString()],
      });
    });

    it('displays the evaluation', async () => {
      await goto(`localhost:8080/articles/${expressionDoi}`);
      const evaluationIsDisplayed = await $(`[id="${evaluationLocator}"]`).exists();

      expect(evaluationIsDisplayed).toBe(true);
    });
  });
});
