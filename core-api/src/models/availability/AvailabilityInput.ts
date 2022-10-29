import { Field, InputType } from "type-graphql";

@InputType()
export class AvailabilityInput {
  @Field()
  public dayOfWeek: number;

  @Field()
  public startTimeUtc: string;

  @Field()
  public endTimeUtc: string;
}