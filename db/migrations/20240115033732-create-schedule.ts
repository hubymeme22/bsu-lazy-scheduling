'use strict';
import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.STRING
      },
      time_type: {
        type: Sequelize.STRING
      },
      section: {
        type: Sequelize.STRING
      },
      initials: {
        type: Sequelize.STRING
      },
      room: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      day: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('Schedules');
  }
};