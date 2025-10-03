import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  console.log('🚀 Rodando migration: invoice_items (UP)');
  await sequelize.getQueryInterface().createTable('invoice_items', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    invoice_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'invoice',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  console.log('🧹 Revertendo migration: invoice_items (DOWN)');
  await sequelize.getQueryInterface().dropTable('invoice_items')
} 