import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserValidateDto } from '../guards/dto/userValidate.dto';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserValidateDto => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
