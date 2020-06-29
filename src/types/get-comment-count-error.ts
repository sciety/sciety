export default class GetCommentCountError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'GetCommentCountError';
  }
}
