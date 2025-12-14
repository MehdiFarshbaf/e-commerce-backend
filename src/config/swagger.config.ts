import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";

export const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle(`داکیومنت مستندات api فروشگاهی`)
        .setDescription(`این مستندات برای تفهیم نحوه کار کردن با این api است.`)
        .setVersion('1.0.0')
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, config)

    const swaggerOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            // docExpansion: 'none',
            filter: false,
            persistAuthorization: true,
            // syntaxHighlight: { activate: true, theme: 'arta' },
            tryItOutEnabled: true,
            // requestSnippetsEnabled: true,
        },
        customSiteTitle: 'E-Commerce System API Documentation',
        
    };

    SwaggerModule.setup('docs', app, document, swaggerOptions)
    console.log('API Docs: http://localhost:3000/docs');
}