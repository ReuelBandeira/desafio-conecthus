export class OutputFindByIdUserUseCaseDto {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
