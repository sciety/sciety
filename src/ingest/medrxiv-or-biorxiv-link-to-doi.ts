export const medrxivOrBiorxivLinkToDoi = (link: string): string => {
  const [, doiSuffix] = /.*\/([^/a-z]*).*$/.exec(link) ?? [];
  return `10.1101/${doiSuffix.replace(/\.$/, '')}`;
};
