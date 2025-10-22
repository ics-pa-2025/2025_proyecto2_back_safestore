import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {setupSwagger} from './config/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    setupSwagger(app);

    // Servir archivos estáticos
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // Habilita CORS solo para el origen dev
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
