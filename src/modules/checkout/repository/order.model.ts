import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ProductModel from "./product.model";

@Table({
  tableName: 'checkout_order',
  timestamps: false
})
export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @ForeignKey(() => ClientModel)
    @Column({allowNull: false})
    declare client_id: string;

    @BelongsTo(() => ClientModel)
    declare client: Awaited<ClientModel>;

    @HasMany(() => ProductModel)
    products: ProductModel[];

    @Column({ allowNull: false })
    status: string

    @Column({ allowNull: false })
    createdAt: Date
}