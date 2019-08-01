export default (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    'Notifications', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      event: DataTypes.STRING,
      userId: DataTypes.UUID,
      payload: DataTypes.JSON,
      notified: DataTypes.BOOLEAN
    }, {}
  );

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Notifications;
};
