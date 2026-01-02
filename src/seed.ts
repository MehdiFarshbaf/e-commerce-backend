import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SeederService } from "./seeder/seeder.service";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule)

    const seeder = app.get(SeederService)

    await seeder.seedPermissions()
    await seeder.seedRoles()

    await app.close()
}

bootstrap().then(() => console.log(`Seeding Complete`)).catch(err => console.log(`Seeding filed`))