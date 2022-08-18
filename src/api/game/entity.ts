import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import { Users } from '../users/entity'
import { Words } from '../words/entity'
@Entity()
export class Games extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    default: 0
  })
  attempts: number

  @Column({
    default: true
  })
  isActive: boolean

  @Column({
    default: false
  })
  win: boolean

  @ManyToOne(() => Users, (users) => users.games, {
    cascade: true
  })
  @JoinColumn({ name: 'usersId' })
  users: Users

  @ManyToOne(() => Words, (words) => words.games, {
    cascade: true
  })
  @JoinColumn({ name: 'wordsId' })
  words: Words

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
