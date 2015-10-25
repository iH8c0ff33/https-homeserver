////////////////
// User model //
////////////////
module.exports = function (Sequelize, db) {
  var User = db.define('users', {
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
      allowNull: false
    },
    permissionLevel: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
  User.sync();
  return User;
};
