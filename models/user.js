// User model
module.exports = function (db, Sequelize) {
  return db.define('users', {
    username: {
      type: Sequelize.STRING(24),
      unique: true,
      allowNull: false
    },
    passwordHash: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    salt: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    permissionLevel: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    permissions: Sequelize.JSON
  });
};
