'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si la columna ya existe
    const tableDescription = await queryInterface.describeTable('ArtifactContexts');
    
    if (!tableDescription.phaseIndex) {
      await queryInterface.addColumn('ArtifactContexts', 'phaseIndex', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ArtifactContexts', 'phaseIndex');
  }
};