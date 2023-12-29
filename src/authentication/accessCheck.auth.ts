import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/classes/error.class";
import { Access } from "../types/enums/access.enum";
import { isObjectIdOrHexString } from "mongoose";



export default function accessCheck(access?: Access, role?: string, options?: { extraFunction?: (req: Request) => boolean }) {
  return function middleware(req: Request, _res: Response, next: NextFunction) {
    const user = req.user;
    switch (user.role) {
      case "admin": break; // have access
      case "user":
        if (access === "extra") {
          if (!options?.extraFunction || !options.extraFunction(req)) return next(new ApiError(403, "No access!"));
          else break;
        }
        if (role === "admin") return next(new ApiError(403, "You are not admin"));
        else break;
      default:
        return next(new ApiError(403, "No access!"));
    }
    return next();
  };
};

export function userCanGetHisInfo(req: Request) {
  const probableParamId = req.path.split('/').at(-1);
  if (req.method == 'GET' &&
    !!req.originalUrl.match("/api/v1/config/admin/users/") &&
    isObjectIdOrHexString(probableParamId) &&
    probableParamId === req.user._id.toString()) {
    return true;
  };
  return false; // no access
};