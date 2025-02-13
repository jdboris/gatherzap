export default class HttpError extends Error {
  /** HTTP status code. */
  status;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;
  }
}
