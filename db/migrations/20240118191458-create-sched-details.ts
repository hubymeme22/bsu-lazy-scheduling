'use strict';
import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('SchedDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      initials: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      section: {
        type: Sequelize.STRING
      },
      student_count: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.STRING
      },
      type: {
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
    await queryInterface.dropTable('SchedDetails');
  }
};