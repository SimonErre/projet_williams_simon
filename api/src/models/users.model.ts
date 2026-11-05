import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface UserAttributes {
  id: number;
  login: string;
  password?: string;
  nom: string;
  prenom: string;
  email: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

export default function defineUsers(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): UserModel {
  const Users = sequelize.define<UserInstance>(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Users;
}
