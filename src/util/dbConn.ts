"use strict";
import { Sequelize } from "sequelize";

const process = require("process");
const env = process.env.NODE_ENV || "local";
const config = require("../config/config");

const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
  // sequelize = new Sequelize(process.env[config.use_env_variable], config);
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    dialect: 'postgres',
    pool: {
      max: 20, // Increase maximum number of connections
      min: 0,
      acquire: 60000, // Increase timeout to 60 seconds (adjust as needed)
      idle: 30000 // Increase idle timeout to 30 seconds (adjust as needed)
    },
    // Other options
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {...config,
      pool: {
        max: 20, // Increase maximum number of connections
        min: 0,
        acquire: 60000, // Increase timeout to 60 seconds (adjust as needed)
        idle: 30000 // Increase idle timeout to 30 seconds (adjust as needed)
      },
    }
  );
}



export default sequelize;