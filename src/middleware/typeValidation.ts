import { Request, Response, NextFunction } from 'express';
import { Model, DataTypes } from 'sequelize';

const mapSequelizeToJsTypes = (sequelizeType: any) => {
  if (sequelizeType instanceof DataTypes.STRING || sequelizeType instanceof DataTypes.TEXT) {
    return 'string';
  }
  if (sequelizeType instanceof DataTypes.INTEGER) {
    return 'number';
  }
  if (sequelizeType instanceof DataTypes.BOOLEAN) {
    return 'boolean';
  }
  if (sequelizeType instanceof DataTypes.DATE) {
    return 'string'; 
  }
  return 'any'; 
};

const typeValidationMiddleware = (model:any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const modelAttributes = model.rawAttributes;

    for (const key of Object.keys(data)) {
      if (modelAttributes[key]) {
        const expectedType = mapSequelizeToJsTypes(modelAttributes[key].type);
        const actualType = typeof data[key];

        if (expectedType !== actualType) {
          return res.status(400).json({
            error: `Invalid type for '${key}'. Expected ${expectedType}, but received ${actualType}.`
          });
        }
      }
    }

    next();
  };
};

export default typeValidationMiddleware;
