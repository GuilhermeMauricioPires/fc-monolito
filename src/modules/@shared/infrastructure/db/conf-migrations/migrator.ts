import { SequelizeStorage, Umzug } from "umzug"
import { Sequelize } from "sequelize"
import { join } from "path"

export const migrator = (
  sequelize: Sequelize
) => {
  return new Umzug({
    migrations: {
      glob: "**/migrations/*.{js,ts}"
    },
    // context: sequelize.getQueryInterface(),
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console
  })
}