import { Repository } from "typeorm";

// The signature for this method was changed because in the `AppointmentService` we have 2 different repositories as dependency and we need somehow to distingue them in the `ConnectionManage`.
const createMockRepo = (mockRepositoriesMap: WeakMap<any, Partial<Repository<any>>>) => {
  return {
    has: () => true,
    get: () => ({
      getRepository: (name: any) => {
        return mockRepositoriesMap.get(name);
      },
    }),
  };
};

export default createMockRepo;
