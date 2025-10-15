import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.token;
    }
);
