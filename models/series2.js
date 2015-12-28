// Series2 model
module.exports = function (Sequelize, db) {
  var Speeds = db.define('data1', {
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
  Speeds.sync();
  return Speeds;
};
