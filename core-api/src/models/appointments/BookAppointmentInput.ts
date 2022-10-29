import { Field, InputType } from "type-graphql";
import { Slot } from "./Slot";

@InputType()
export class BookAppointmentInput {
  @Field()
  public slot: Slot;

  @Field()
  public patientName: string;

  @Field()
  public description: string;
}