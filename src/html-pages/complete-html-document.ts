export type CompleteHtmlDocument = string & { readonly CompleteHtmlDocument: unique symbol };

export const toCompleteHtmlDocument = (value: string): CompleteHtmlDocument => value as CompleteHtmlDocument;
