import { Request, Response } from 'express';

/**
 * IF YOU WANT TO CREATE CUSTOME ERROR IN TRY
 * @param error throw Object.assign(new Error('Error Message'), { status: 403 });
 * @returns
 */

export function CatchError(req: Request, res: Response, error: any) {
  if (error != null && error instanceof Error) {
    return res.status(500).send({
      status: 500,
      message: error.message,
      errors: error,
    });
  }
  return res.status(500).send({
    status: 500,
    message: 'Internal Server Error',
    errors: error,
  });
}
