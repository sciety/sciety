export const uriIsMissingBiorxivMedrxivDoiPrefix = (uri: string): boolean => !(uri.includes('10.64898') || uri.includes('10.1101'));
