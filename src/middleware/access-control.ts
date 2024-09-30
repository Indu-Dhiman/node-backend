import { Request, Response, NextFunction } from "express";
import { checkAccessToken } from "../util/auth";

interface AuthenticatedRequest extends Request {
  user?: { role: string; }; 
}

const validateToken = async (token: string) => {
  const { data, error }: any = await checkAccessToken(token);

  if (error) {
    switch (error.name) {
      case "JsonWebTokenError":
        throw { status: 403, code: "ERR_INVALID_ACCESS_TOKEN" };
      case "TokenExpiredError":
        throw { status: 403, code: "ERR_ACCESS_TOKEN_EXPIRED" };
      default:
        throw { status: 403, code: "ERR_INVALID_ACCESS_TOKEN" };
    }
  }
  return data.user;
};

const accessControl = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.header("authorization")?.replace("Bearer ", "");
    if (!authToken) {
      return res.status(401).json({
        error: {
          code: "ERR_ACCESS_TOKEN_MISSING",
          message: "Authorization-Header is not set",
        },
      });
    }

    const user = await validateToken(authToken);
    req.user = user;
    
    if ( user.role !== 'admin') {
      return res.status(403).json({
        error: {
          code: "ERR_FORBIDDEN",
          message: "Admin access required",
        },
      });
    }

    next()
  } catch (error:any) {
    return res.status(error.status || 500).json({
      error: {
        code: error.code || "ERR_SERVER_ERROR",
        message: error.message || "Something went wrong",
      },
    });
  }
};

export default accessControl;
