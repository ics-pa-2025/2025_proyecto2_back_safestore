import { IsString } from "class-validator";

export class ResponseCustomerDto {
        id: number;
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
        documento: number;
}
