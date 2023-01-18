import { Sequelize } from "sequelize";

const sequelizeMaker = (
    storage: string
): Sequelize => {
  return new Sequelize({
    dialect: "sqlite",
    host: storage,
    logging: false
  });
}; 

export default sequelizeMaker; 