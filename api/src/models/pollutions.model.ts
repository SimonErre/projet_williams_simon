import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface PollutionAttributes {
  id: number;
  titre?: string | null;
  type?: string | null;
  lieu?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  photo?: string | null;
  ville?: string | null;
  valeur?: number | null;
  polluant?: string | null;
  date: string;
  description?: string | null;
}

export interface PollutionCreationAttributes
  extends Optional<
    PollutionAttributes,
    | "id"
    | "titre"
    | "type"
    | "lieu"
    | "latitude"
    | "longitude"
    | "photo"
    | "ville"
    | "valeur"
    | "polluant"
    | "description"
  > {}

export interface PollutionInstance
  extends Model<PollutionAttributes, PollutionCreationAttributes>,
    PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

export default function definePollutions(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): PollutionModel {
  const Pollutions = sequelize.define<PollutionInstance>(
    "pollution",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lieu: {
        type: DataTypes.STRING,
        allowNull: true
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ville: {
        type: DataTypes.STRING,
        allowNull: true
      },
      valeur: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      polluant: {
        type: DataTypes.STRING,
        allowNull: true
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "pollution",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Pollutions;
}
