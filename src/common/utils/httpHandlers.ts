import { Request, Response, NextFunction } from "express";
import { ResponseStatus, ServiceResponse } from "../models/serviceResponse";
import { ZodError, ZodIssue, ZodSchema, ZodUnrecognizedKeysIssue } from "zod";
import { StatusCodes } from "http-status-codes";

const formatZodErrors = (zodError: ZodError): string => {
  const formatZodIssue = (issue: ZodIssue): string => 
    `${issue.path.join('.') || (issue as ZodUnrecognizedKeysIssue).keys.join('.')} - ${issue.message}`

  return `Invalid input for following fields: ${zodError.issues.map(formatZodIssue).join(', ')}`
}

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) =>
  response.status(serviceResponse.statusCode).send(serviceResponse);

export const validateBody = (schema: ZodSchema) => ( req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next()
  } catch (error) {
    const message = formatZodErrors(error as ZodError);
    const serviceResponse = new ServiceResponse(ResponseStatus.Failure, StatusCodes.BAD_REQUEST, message)
    handleServiceResponse(serviceResponse, res);
  }
}

export const validateParams = (schema: ZodSchema) => ( req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.params);
    next()
  } catch (error) {
    const message = formatZodErrors(error as ZodError);
    const serviceResponse = new ServiceResponse(ResponseStatus.Failure, StatusCodes.BAD_REQUEST, message)
    handleServiceResponse(serviceResponse, res);
  }
}
