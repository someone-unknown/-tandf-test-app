import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { Availability } from "./Availability";

@ObjectType()
@Entity()
export class Doctor extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field(() => [Availability], { nullable: true })
  @OneToMany(() => Availability, (availability: Availability): Doctor => availability.doctor, { lazy: true })
  public availability?: Availability[];

  @Field(() => [Appointment], { nullable: true })
  @OneToMany(() => Appointment, (appointment: Appointment): Doctor => appointment.doctor, { lazy: true })
  public appointments?: Appointment[];
}