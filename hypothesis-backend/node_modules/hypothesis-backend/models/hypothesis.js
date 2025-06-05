module.exports = (sequelize, DataTypes) => {
    const Hypothesis = sequelize.define('Hypothesis', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      problem: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      solution: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      customerSegment: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      valueProposition: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Hypothesis.associate = (models) => {
      Hypothesis.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
  
      Hypothesis.hasMany(models.Artifact, {
        foreignKey: 'hypothesisId',
        as: 'artifacts',
        onDelete: 'CASCADE'
      });
    };
  
    return Hypothesis;
  };