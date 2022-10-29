export class NotImplementedException extends Error {
  public constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, NotImplementedException);
  }
}