import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  console.log('🚀 Rodando migration: transactions (UP)');
  await sequelize.getQueryInterface().createTable('transactions', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // references: {
      //   model: 'checkout_order',
      //   key: 'id',
      // },
      // onUpdate: 'CASCADE',
      // onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },    
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  console.log('🧹 Revertendo migration: transactions (DOWN)');
  await sequelize.getQueryInterface().dropTable('transactions')
} 