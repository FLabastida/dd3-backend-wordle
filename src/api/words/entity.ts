import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from 'typeorm'
import { Games } from '../game/entity'
@Entity()
export class Words extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  word: string

  @Column({
    default: 0
  })
  totalHits: number

  @Column({
    default: 0
  })
  totalPlayed: number

  @Column({
    default: false
  })
  isActive: boolean

  @OneToMany(() => Games, (games) => games.words)
  games: Games[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
