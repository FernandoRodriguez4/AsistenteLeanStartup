module.exports = (sequelize, DataTypes) => {
  const ArtifactContext = sequelize.define('ArtifactContext', {
    hypothesisId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    artifactId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contextData: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    embedding: {
      type: DataTypes.TEXT, // Almacenaremos el embedding como JSON string
      allowNull: false
    },
    phase: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phaseIndex: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir null para registros existentes
      defaultValue: null
    }
  });

  ArtifactContext.associate = (models) => {
    ArtifactContext.belongsTo(models.Hypothesis, {
      foreignKey: 'hypothesisId',
      as: 'hypothesis'
    });
    
    ArtifactContext.belongsTo(models.Artifact, {
      foreignKey: 'artifactId',
      as: 'artifact'
    });
  };

  return ArtifactContext;
};