'use strict';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      googleEmail: DataTypes.STRING,
      profileImg: DataTypes.STRING,
      score: DataTypes.INTEGER,
      nickname: DataTypes.STRING,
    },
    {},
  );
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
