// Series model
module.exports = function(Sequelize, db) {
  var Temps = db.define('data', {
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
  Temps.sync();
  return Temps;
};
