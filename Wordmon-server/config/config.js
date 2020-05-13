module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'wordmon',
    host: 'database-shortly.cnkawthfb2rt.us-west-2.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',
    //dialect: 'postgres',
    dialectOptions: {
      ssl: 'Amazon RDS',
    },
    logging: false,
  },
};
