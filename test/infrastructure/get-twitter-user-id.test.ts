describe('get-twitter-user-id', () => {
  describe('when the user handle exists', () => {
    // {
    //   "data": {
    //     "id": "47998559",
    //     "name": "Giorgio Sironi 🇮🇹🇬🇧🇪🇺",
    //     "username": "giorgiosironi"
    //   }
    // }
    it.todo('returns a UserId');
  });

  describe('when the user handle does not exist', () => {
    // {
    //   "errors": [
    //     {
    //       "value": "giggggfbgfb",
    //       "detail": "Could not find user with username: [giggggfbgfb].",
    //       "title": "Not Found Error",
    //       "resource_type": "user",
    //       "parameter": "username",
    //       "resource_id": "giggggfbgfb",
    //       "type": "https://api.twitter.com/2/problems/resource-not-found"
    //     }
    //   ]
    // }
    it.todo('returns not found');
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
