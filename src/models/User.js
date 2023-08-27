import { DataTypes } from "sequelize";

const User = (sequelize) => {
  sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price_service: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("activo", "inactivo"),
      defaultValue: "activo",
    },
    rate: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },{
    tableName: 'users'
  });
};

export default User;
