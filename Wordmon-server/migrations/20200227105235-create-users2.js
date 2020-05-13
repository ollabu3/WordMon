'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      googleEmail: {
        unique: true,
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      profileImg: {
        // DB에 이미지를 어떻게 저장되는지 타입을 정해야 한다.
        //이미지 경로 저장
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
