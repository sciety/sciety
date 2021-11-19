export const medrxivOrBiorxivLinkToDoi = (link: string): string => {
  const [, doiSuffix] = /.*\/([^/]*)$/.exec(link) ?? [];
  return `10.1101/${doiSuffix}`;
};
