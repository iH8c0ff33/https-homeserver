// Series2 model
module.exports = function (db, Sequelize) {
  return db.define('data1', {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    time: {
      type: Sequelize.DATE,
      unique: true,
      allowNull: false
    }
  });
};
