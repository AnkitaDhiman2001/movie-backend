import sequelizeDb from "../db/database";
import { DataTypes, Model } from "sequelize";

const Watchlists = sequelizeDb.define(
  "watchlists",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },        
    mediaId: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaPoster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
    {
        timestamps: true
    }
);
export default Watchlists;

    