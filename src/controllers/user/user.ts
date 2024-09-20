import { Request, Response } from "express";
import { Sequelize, Op } from "sequelize";
import * as bcrypt from "bcrypt";
import User from "models/user";
import { checkAccessToken, generateTokens } from "../../util/auth"


const createUser = async (req: Request, res: Response) => {
    try {
      const emailExists = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      if (emailExists) {
        return res.sendError(res, "ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST");
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const usernameExists = await User.findOne({
        where: {
          username: req.body.username,
        },
      });
  
      if (usernameExists) {
        return res.sendError(res, "ERR_AUTH_USERNAME");
      }
      const userCreated = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      };
      const user = await User.create(userCreated);
      var { accessToken } = await generateTokens(user.dataValues.id);
      return res.sendSuccess(res, { user, accessToken });
    } catch (error: any) {
      console.log(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };
  
  const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        return res.sendError(res, "Email Not Found");
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.sendError(res, "Password Not Matched");
      }
      var { accessToken } = await generateTokens(user.dataValues.id);
      return res.sendSuccess(res, { user, accessToken });
    } catch (error: any) {
      console.error(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };
  

export {
    createUser,
    loginUser,
  
};