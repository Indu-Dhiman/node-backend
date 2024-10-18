// models/Chat.js
import { DataTypes } from 'sequelize';
import sequelize from '../util/dbConn'; // Adjust the path based on your structure

const Chat = sequelize.define('Chat', {
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default Chat;
