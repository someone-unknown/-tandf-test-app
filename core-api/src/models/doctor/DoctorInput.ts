import { Field, InputType } from "type-graphql";
import { AvailabilityInput } from '@/models/availability/AvailabilityInput';

@InputType()
export class DoctorInput {
  @Field({ nullable: true })
  public id?: number;

  @Field()
  public name!: string;

  @Field(() => [AvailabilityInput], { nullable: true })
  public availability?: AvailabilityInput[];
}