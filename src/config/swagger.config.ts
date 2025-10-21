import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API Swagger')
    .setDescription('Documentación de endpoints de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // expose the raw OpenAPI JSON for debugging (useful to inspect schemas)
  app.use('/api/docs-json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });
}
