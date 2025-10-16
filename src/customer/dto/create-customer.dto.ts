import { Type } from "class-transformer";
import { IsString, Max, IsInt, Min } from "class-validator";

export class CreateCustomerDto {
        @IsString()
        name: string;
        @IsString()
        lastName: string;
        @IsString()
        email: string;
        @IsString()
        address: string;
        @IsString()
        phone: string;
        @Type(() => Number)
        @IsInt()
        @Min(10000000)
        @Max(99999999)
        documento: number;
}
