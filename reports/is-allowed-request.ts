type IsAllowedRequest = (request: string) => boolean;

const allowedPostPaths = [
  '/follow',
  '/unfollow',
  '/save-article',
  '/unsave-article',
  '/respond',
];

export const isAllowedRequest: IsAllowedRequest = (request) => {
  if (!request.startsWith('POST ')) {
    return true;
  }

  const matches = request.match(/^POST ([^ ]+) HTTP/);

  return !!matches && allowedPostPaths.includes(matches[1]);
};
