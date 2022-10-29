import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor";

@ObjectType()
@Entity()
export class Availability extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public dayOfWeek: number;

  @Field()
  @Column()
  public startTimeUtc: string;

  @Field()
  @Column()
  public endTimeUtc: string;

  @Field(() => Doctor)
  @ManyToOne(() => Doctor, (doctor: Doctor): Availability[] => doctor.availability, { lazy: true })
  public doctor: Doctor;
}