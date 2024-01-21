'use strict';
import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('FooterDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      initials: {
        type: Sequelize.STRING
      },
      official_time: {
        type: Sequelize.STRING
      },
      teaching_hours: {
        type: Sequelize.STRING
      },
      overtimeWithin: {
        type: Sequelize.STRING
      },
      overtimeOutside: {
        type: Sequelize.STRING
      },
      designation: {
        type: Sequelize.STRING
      },
      preparations: {
        type: Sequelize.STRING
      },
      hours_per_week: {
        type: Sequelize.STRING
      },
      regular_load: {
        type: Sequelize.STRING
      },
      overload: {
        type: Sequelize.STRING
      },
      academic_rank: {
        type: Sequelize.STRING
      },
      consultation_hours: {
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
    await queryInterface.dropTable('FooterDetails');
  }
};