export type RedirectTarget = {
  tag: 'redirect-target',
  target: string,
};

export const toRedirectTarget = (target: string): RedirectTarget => ({
  target,
  tag: 'redirect-target',
});
