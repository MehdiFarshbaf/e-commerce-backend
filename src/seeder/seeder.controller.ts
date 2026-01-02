import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SeederService } from './seeder.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('seeder')
export class SeederController {

    constructor(private seederService: SeederService) { }

    @Public()
    @ApiOperation({ summary: 'run seeders' })
    @Get('seeder_permissions_and_roles')
    @HttpCode(HttpStatus.OK)
    async seederPermissionsAndRoles() {
        await this.seederService.seedPermissions()
        await this.seederService.seedRoles()
        return {
            success: true,
            message: 'run seeder successfully',
        };
    }
}
