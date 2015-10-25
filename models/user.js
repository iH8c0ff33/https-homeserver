////////////////
// User model //
////////////////
module.exports = function (Sequelize, db) {
  var User = db.define('users', {
    username: {
      type: Sequelize.STRING(24),
      unique: true,
      validate: {
        notNull: true
      }
    },
    passwordHash: {
      type: Sequelize.BLOB,
      validate: {
        notNull: true
      }
    },
    salt: {
      type: Sequelize.BLOB,
      validate: {
        notNull: true
      }
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        notNull: true
      }
    }
  });
  User.sync();
  return User;
};
