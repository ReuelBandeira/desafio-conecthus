import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { FindUsersQueryDto } from '../../application/dtos/find-users-query.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserFilterDto } from '../../application/dtos/user.filter.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { FindAllUserUseCase } from '../../application/use-cases/find-all-user/find-all-user.use-case';
import { FindByIdUserUseCase } from '../../application/use-cases/find-by-id-user/find-by-id-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user/update-user.use-case';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findByIdUserUseCase: FindByIdUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({
    status: 409,
    description: 'Matrícula ou e-mail já cadastrados',
  })
  async create(@Body() input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Matrícula/e-mail já em uso, ou usuário inativo',
  })
  async update(@Param('id') id: string, @Body() input: UpdateUserDto) {
    input.id = id;
    return this.updateUserUseCase.execute(input);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
  async findById(@Param('id') id: string) {
    return this.findByIdUserUseCase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuários' })
  @ApiQuery({
    name: 'filter',
    required: false,
    style: 'deepObject',
    explode: true,
    type: UserFilterDto,
  })
  async find(@Query() query: FindUsersQueryDto) {
    return this.findAllUserUseCase.execute(query);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
