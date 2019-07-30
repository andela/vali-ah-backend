export default (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    'Notifications',
    {
      event: DataTypes.STRING,
      userId: DataTypes.UUID,
      payload: DataTypes.JSON,
      notified: DataTypes.BOOLEAN
    },
    {}
  );

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Notifications;
};
