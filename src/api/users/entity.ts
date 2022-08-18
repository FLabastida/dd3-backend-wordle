
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from 'typeorm'
import { Games } from '../game/entity'
@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true
  })
  username: string

  @Column()
  password: string

  @Column({
    default: 0
  })
  totalGames: number

  @Column({
    default: 0
  })
  victories: number

  @OneToMany(() => Games, (games) => games.users)
  games: Games[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
