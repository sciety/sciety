import { openBrowser } from 'taiko';
import { arbitraryString } from '../test/helpers';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';

describe('journey-to-create-new-list', () => {
  describe('when the user is on their My Lists page', () => {
    beforeEach(async () => {
      const userId = arbitraryUserId();
      await callApi('api/create-user', {
        userId,
        handle: arbitraryUserHandle(),
        avatarUrl: 'http://somethingthatproducesa404',
        displayName: arbitraryString(),
      });
      await openBrowser();
    });

    afterEach(screenshotTeardown);

    describe('when they create a new list', () => {
      it.todo('they end up on the My Lists page with a new list, and a customized name and a description');
    });
  });
});
