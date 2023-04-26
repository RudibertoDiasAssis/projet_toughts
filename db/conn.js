const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('projet_toughts', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})


try {
  sequelize.authenticate()
  console.log('Conectamos com o Sequelize!')
} catch (error) {
  console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize;