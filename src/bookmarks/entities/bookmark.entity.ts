import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Bookmark extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  title: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  url: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.UUID })
  UserId: string;

  @BelongsTo(() => User, 'UserId')
  users: User;
}
