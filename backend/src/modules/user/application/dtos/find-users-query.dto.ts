import { USER_SORTABLE_FIELDS } from '@/modules/user/domain/value-objects/sortable-fields.vo';
import type { UserSortableField } from '@/modules/user/domain/value-objects/sortable-fields.vo';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  ValidateNested,
} from 'class-validator';
import { UserFilterDto } from './user.filter.dto';

export class FindUsersQueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Itens por página (padrão: 5, máx: 100)',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  limit?: number;

  @IsOptional()
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @ApiPropertyOptional({ enum: USER_SORTABLE_FIELDS })
  @IsIn(USER_SORTABLE_FIELDS)
  orderBy?: UserSortableField;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilterDto)
  @ApiPropertyOptional({ type: UserFilterDto })
  filter?: UserFilterDto;
}
