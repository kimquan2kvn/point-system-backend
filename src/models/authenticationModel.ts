import { DataTypes, Model, Sequelize } from "sequelize";
import { EnumRole } from "../util/enum/role";

type PlainObject = Record<string, unknown>;

export abstract class BaseModel<
  TModelAttributes extends PlainObject = any,
  TCreationAttributes extends PlainObject = TModelAttributes
> extends Model<TModelAttributes, TCreationAttributes> {
  static initModel: (
    sequelizeInstance: Sequelize
  ) => ReturnType<typeof this.init>;

  static afterInit: (sequelizeInstance: Sequelize) => unknown;
}

export class UserModel extends BaseModel {
  declare id: string;
  declare user_name: string;
  declare password: string;
  declare name: string;
  declare role: number;
}

UserModel.initModel = (sequelizeInstance: Sequelize) => {
  return UserModel.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_name: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      role: {
        type: DataTypes.INTEGER,
        defaultValue: EnumRole.SINH_VIEN,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: "user",
      underscored: true,
      name: {
        plural: "users",
        singular: "user",
      },
    }
  );
};
