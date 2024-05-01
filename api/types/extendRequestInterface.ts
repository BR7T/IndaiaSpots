declare module 'express-serve-static-core' {
  namespace Express {
    interface Request {
      user?,
      file?;
    }
  }
}
export function customRequestExtender() {}