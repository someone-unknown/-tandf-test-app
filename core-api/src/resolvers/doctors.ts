import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { DoctorInput } from "@/models/doctor/DoctorInput";
import { DoctorService } from "@/services/DoctorService";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Doctor)
export class DoctorResolver {
  public constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @Query(() => [Doctor])
  public async doctors(): Promise<Doctor[]> {
    return this.doctorService.getDoctors();
  }

  @Mutation(() => Doctor)
  public async doctor(
    @Arg('doctor') doctor: DoctorInput,
  ): Promise<Doctor> {
    return await this.doctorService.addOrUpdateDoctor(doctor);
  }

  @Query(() => [Slot])
  public async slots(
    @Arg('from') from: Date,
    @Arg('to') to: Date,
  ): Promise<Slot[]> {
    return await this.doctorService.getAvailableSlots(from, to);
  }
}