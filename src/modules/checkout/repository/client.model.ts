import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: 'checkout_client',
  timestamps: false
})
export class ClientModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    email: string

    @Column({ allowNull: false })
    address: string

    @HasMany(() => OrderModel)
    orders: OrderModel[];

    @Column({ allowNull: false })
    createdAt: Date
}