export enum ResponseStatus {
  Success,
  Failure,
}

export class ServiceResponse<T = null> {
  success: boolean;
  statusCode: number;
  responseObject?: T;
  message?: string;

  constructor(status: ResponseStatus, statusCode: number, message?: string, responseObject?: T) {
    this.success = status === ResponseStatus.Success;
    this.statusCode = statusCode;
    this.message = message;
    this.responseObject = responseObject;
  }
}
