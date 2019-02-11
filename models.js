const Sequelize = require('sequelize');

// Or you can simply use a connection uri
const sequelize = new Sequelize('sqlite:rcmapp.db');

const User = sequelize.define('user', {
  email: {
     type: Sequelize.STRING,
     allowNull: false,
     unique: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
  },
  batch: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  social: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tech: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  stay: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

const Address = sequelize.define('address', {
  current: {
    type: Sequelize.BOOLEAN
  },
  latitude: {
    type: Sequelize.DECIMAL(16)
  },
  longitude: {
    type: Sequelize.DECIMAL(16)
  }
});

Address.hasMany(User);

sequelize.sync()

module.exports = {
  User,
  Address
}