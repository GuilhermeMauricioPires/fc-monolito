import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  console.log('🚀 Rodando migration: checkout_order (UP)');
  await sequelize.getQueryInterface().createTable('checkout_order', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'checkout_client',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  console.log('🧹 Revertendo migration: checkout_order (DOWN)');
  await sequelize.getQueryInterface().dropTable('checkout_order')
} 