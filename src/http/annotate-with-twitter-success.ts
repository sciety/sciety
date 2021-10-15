export const annotateWithTwitterSuccess = (url: string): string => {
  const param = 'login_success=twitter';
  if (url.includes(param)) {
    return url;
  }
  const joinChar = url.indexOf('?') > -1 ? '&' : '?';
  return `${url}${joinChar}${param}`;
};
