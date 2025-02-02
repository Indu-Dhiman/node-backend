import { Request, Response } from "express";
import { Sequelize, Op } from "sequelize";
import * as bcrypt from "bcrypt";
import User from "../../models/user";
import { checkAccessToken, generateTokens } from "../../util/auth"
import * as crypto from "crypto";
import UserToken from "../../models/user-token.model";
import { sendForgotEmail } from "../../provider/send-mail";
import hash from "../../util/hash";


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
        role:req.body.role,
        platform:req.body.platform
      };
      const user = await User.create(userCreated);
      var { accessToken } = await generateTokens(user.dataValues.id,user?.dataValues?.role);
      return res.sendSuccess(res, { user, accessToken });
    } catch (error: any) {
      console.log(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };
  
  const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password,platform } = req.body;
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        return res.sendError(res, "Email Not Found");
      }
      const validPlatforms = ['email', 'google', 'facebook'];
      if (!validPlatforms.includes(platform)) {
        return res.sendError(res, "Unsupported platform. Please use email, Google, or Facebook.");
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.sendError(res, "Password Not Matched");
      }
      var { accessToken } = await generateTokens(user.dataValues.id,user.dataValues.role);
      return res.sendSuccess(res, { user, accessToken });
    } catch (error: any) {
      console.error(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };

  const updateUserProfile=async(req:Request,res:Response)=>{
    try{
      const {id,username,userProfile}=req.body
      const user = await User.findByPk(id);

      if (!user) {
        return res.sendError(res, "User not found");
      }
      const updatedData: any = {};
      if (username) {
        updatedData.username = username;
      }
      if (userProfile) {
        updatedData.userProfile = userProfile;
      }
  
      // If nothing is provided to update
      if (Object.keys(updatedData).length === 0) {
        return res.sendError(res, "No data provided to update");
      }
  
      // Update the user in the database
      await user.update(updatedData);
  
      return res.sendSuccess(res, { user });
    }
    catch (error: any) {
      console.error(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };
  const forgotPassword = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.sendError(res, "ERR_AUTH_WRONG_USERNAME_OR_PASSWORD");
      }
  
      let resetToken = crypto.randomBytes(32).toString("hex");
      let token = await UserToken.findOne({ where: { user_id: user.id } });
      if (!token) {
        await UserToken.create({
          user_id: user.id,
          token: resetToken,
          createdAt: Date.now(),
        });
      } else {
        await UserToken.update(
          { token: resetToken },
          {
            where: {
              id: token.id,
            },
          }
        );
      }
      const link = `${process.env.ADMIN_URL}/auth/reset-password?token=${resetToken}`;
  
      sendForgotEmail(link, user.email);
      return res.send({
        success: true,
        message: "Forgot password email has been send",
      });
    } catch (error: any) {
      console.error(error);
      return res.sendError(res, error.message);
    }
  };
  
  const resetPassword = async (req: Request, res: Response) => {
    console.log(req.body.token, "===");
    try {
      const userToken = await UserToken.findOne({
        where: { token: req.body.token },
      });
      if (!userToken) {
        return res.sendError(res, "ERR_AUTH_WRONG_TOKEN");
      }
      await UserToken.destroy({ where: { id: userToken.id } });
      await User.update(
        {
          password: await hash.generate(req.body.password),
        },
        {
          where: {
            id: userToken.user_id,
          },
        }
      );
      return res.send({ status: true, message: "Password changed successfully" });
    } catch (error: any) {
      console.error(error);
      return res.sendError(res, error.message);
    }
  };

  const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user', 
        },
        order: [['createdAt', 'ASC']], 
      });
      console.log(users,"================")
     return res.sendSuccess(res, users);
    } catch (error: any) {
      console.error(error);
      return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
  };

  const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 

        const user = await User.findByPk(id);
        if (!user) {
            return res.sendError(res, "User not found");
        }

        await User.destroy({ where: { id } });

        return res.sendSuccess(res, { message: "User deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
};

  
export {
    createUser,
    updateUserProfile,
    loginUser,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser
  
};