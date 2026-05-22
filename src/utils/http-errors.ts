export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export function validationError(message: string) {
  return new HttpError(400, message);
}

export function notFound(message: string) {
  return new HttpError(404, message);
}
