module.exports = (sequelize, DataTypes) => {
    const Artifact = sequelize.define('Artifact', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phase: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      hypothesisId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Artifact.associate = (models) => {
      Artifact.belongsTo(models.Hypothesis, {
        foreignKey: 'hypothesisId',
        as: 'hypothesis'
      });
    };
  
    return Artifact;
  };