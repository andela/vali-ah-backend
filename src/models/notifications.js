export default (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    'Notifications',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      event: DataTypes.STRING,
      userId: DataTypes.UUIDV4,
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
