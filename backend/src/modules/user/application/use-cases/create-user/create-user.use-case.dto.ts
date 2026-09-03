export class InputCreateUserUseCaseDto {
  name: string;
  registration: string;
  email: string;
  password: string;
  isActive: boolean;
}

export class OutputCreateUserUseCaseDto {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
