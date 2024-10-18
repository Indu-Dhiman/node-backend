import { Request, Response } from "express";
import Chat from "../../models/chat";
import { Op } from "sequelize";

const getChatHistory = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        const chatHistory = await Chat.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            order: [["createdAt", "ASC"]],
        });

        res.sendSuccess(res, chatHistory); 
    } catch (error: any) {
        console.error(error);
        return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
};

const sendMessage = async (req: Request, res: Response) => {
    const { message, senderId, receiverId } = req.body;

    try {
        const newMessage = await Chat.create({
            message,
            senderId,
            receiverId,
        });

        res.sendSuccess(res, newMessage); 
    } catch (error: any) {
        console.error(error);
        return res.sendError(res, "ERR_INTERNAL_SERVER_ERROR");
    }
};

export { getChatHistory, sendMessage };
