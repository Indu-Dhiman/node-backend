import { Request, Response, NextFunction } from "express";
import { checkAccessToken } from "../util/auth"; // External token check

interface AuthenticatedRequest extends Request {
  user?: { role: string; }; // Add role to user type
}

// Helper function to validate token and return user data or an error
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
  return data.user; // Assuming user object has role property
};

const accessControl = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from the authorization header
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
    
    console.log(user,"userrole===============================")
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
