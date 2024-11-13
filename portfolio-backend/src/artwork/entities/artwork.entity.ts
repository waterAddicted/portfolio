import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status {
  VISIBLE = 0,
  HIDDEN = 1
}

  
@Entity()
export class Artwork {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100})
    title: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({type:'enum' ,enum : Status, default: Status.VISIBLE})
    status: Status;

    @Column({type: 'varchar', length: 100})
    clientUrl: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    artworkImageUrl: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
