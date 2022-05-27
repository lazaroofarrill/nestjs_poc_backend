import { ApiProperty } from '@nestjs/swagger'

export class RelationDto {
  @ApiProperty({ format: 'uuid' })
  id: string
}
