import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: "checkout_product",
  timestamps: false,
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    salesPrice: number;

    @ForeignKey(() => OrderModel)
    @Column({allowNull: false})
    declare order_id: string;

    @BelongsTo(() => OrderModel)
    declare order: Awaited<OrderModel>;

    @Column({ allowNull: false })
    createdAt: Date
}
