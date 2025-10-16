import { PartialType } from '@nestjs/mapped-types';
import { CreateSellDetailDto } from './create-sell-detail.dto';

export class UpdateSellDetailDto extends PartialType(CreateSellDetailDto) {}
