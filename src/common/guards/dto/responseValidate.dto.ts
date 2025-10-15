import { UserValidateDto } from './userValidate.dto';

export class ResponseValidateDto {
    valid: boolean;
    user: UserValidateDto;
}
