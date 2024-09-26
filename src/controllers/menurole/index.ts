import { Request, Response } from "express";
import mainItems from "../../models/main-items";

const getMenuLits = async (req: Request, res: Response) => {
    try {
      const users = await mainItems.findAll({
        order: [['createdAt', 'ASC']], 
      });
      res.sendSuccess(res, users);
    } catch (error: any) {
      console.error(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };
  export default getMenuLits
