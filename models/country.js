'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({City, Region}) {
      this.hasMany(City, {foreignKey: "country_id"});
      this.hasMany(Region, {foreignKey: "country_id"});
    }
  }
  Country.init({
    country_name: DataTypes.STRING,
    iso2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};