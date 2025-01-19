export const dataSourceConfig = new typeorm.DataSource({
  type: "mysql",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "",
  database: "balticinspection",
  synchronize: true,
  entities: [require("./entity/Category")],
});
