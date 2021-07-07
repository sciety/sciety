import * as E from 'fp-ts/Either';
import { GetTwitterResponse } from '../../src/infrastructure/get-twitter-response';
import { getTwitterUserId } from '../../src/infrastructure/get-twitter-user-id';
import * as DE from '../../src/types/data-error';
import { arbitraryWord } from '../helpers';
import { arbitraryUserId } from '../types/user-id.helper';

describe('get-twitter-user-id', () => {
  describe('when the user handle exists', () => {
    it('returns a UserId', async () => {
      const userId = arbitraryUserId();
      const getTwitterResponse: GetTwitterResponse = async () => ({
        data: {
          id: userId.toString(),
          name: 'Giorgio Sironi 🇮🇹🇬🇧🇪🇺',
          username: 'giorgiosironi',
        },
      });
      const result = await getTwitterUserId(getTwitterResponse)(arbitraryWord())();

      expect(result).toStrictEqual(E.right(userId));
    });
  });

  describe('when the user handle does not exist', () => {
    it('returns not found', async () => {
      const getTwitterResponse: GetTwitterResponse = async () => ({
        errors: [
          {
            value: 'giggggfbgfb',
            detail: 'Could not find user with username: [giggggfbgfb].',
            title: 'Not Found Error',
            resource_type: 'user',
            parameter: 'username',
            resource_id: 'giggggfbgfb',
            type: 'https://api.twitter.com/2/problems/resource-not-found',
          },
        ],
      });
      const result = await getTwitterUserId(getTwitterResponse)(arbitraryWord())();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('when the user handle is not valid', () => {
    // {
    //   "errors": [
    //     {
    //       "parameters": {
    //         "username": [
    //           "giorgdcsadsacsacdsani"
    //         ]
    //       },
    //       "message": "The `username` query parameter value [...] does not match ^[A-Za-z0-9_]{1,15}$"
    //     }
    //   ],
    //   "title": "Invalid Request",
    //   "detail": "One or more parameters to your request was invalid.",
    //   "type": "https://api.twitter.com/2/problems/invalid-request"
    // }
    it.todo('returns unavailable');
  });
});
