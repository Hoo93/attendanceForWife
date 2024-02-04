import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorReponse } from './error-reponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = new ErrorReponse();
    errorResponse.type = exception?.name;
    errorResponse.path = httpAdapter.getRequestUrl(ctx.getRequest());
    errorResponse.timestamp = new Date().toLocaleString();
    errorResponse.message = typeof exception === 'string' ? exception : exception?.message;

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}
