import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor";

@ObjectType()
@Entity()
export class Appointment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => Doctor)
  @ManyToOne(() => Doctor, (doctor: Doctor): Appointment[] => doctor.appointments, { lazy: true })
  public doctor: Doctor;

  @Field()
  @CreateDateColumn()
  public startTime: Date;

  @Field()
  @Column({
    default: 15,
  })
  public durationMinutes: number;

  @Field()
  @Column()
  public patientName: string;

  @Field()
  @Column({ nullable: true })
  public description?: string;
}