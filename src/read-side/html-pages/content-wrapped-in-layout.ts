export type ContentWrappedInLayout = string & { readonly ContentWrappedInLayout: unique symbol };

export const toContentWrappedInLayout = (value: string): ContentWrappedInLayout => value as ContentWrappedInLayout;
