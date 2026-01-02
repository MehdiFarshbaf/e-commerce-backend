import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { Repository } from 'typeorm';
import { seederDataPermissions } from './data/seederDataPermissions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService 
// implements OnApplicationBootstrap
 {

    constructor(
        private configService: ConfigService,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
    ) { }

    // async onApplicationBootstrap() {
    //     await this.seedPermissions()
    //     await this.seedRoles()
    // }

    async seedPermissions() {
        for (const pername of seederDataPermissions) {
            let checkPermission = await this.permissionRepository.findOne({ where: { name: pername } })
            if (!checkPermission) {
                const newPermission = this.permissionRepository.create({ name: pername })
                await this.permissionRepository.save(newPermission)
            }
        }
    }

    async seedRoles() {

        const ROLE_SUPER_ADMIN = this.configService.get<string>('ROLE_SUPER_ADMIN')!;
        const rolesData = [ROLE_SUPER_ADMIN, 'manager', 'usre']

        // All Permissions
        const permissions = await this.permissionRepository.find()

        for (const role of rolesData) {
            let checkRole = await this.roleRepository.findOne({ where: { name: role } })

            if (!checkRole) {
                const newRole = this.roleRepository.create({
                    name: role,
                    permissions: role == ROLE_SUPER_ADMIN ? permissions : []
                })
                await this.roleRepository.save(newRole)
            } else {
                if (checkRole.name === ROLE_SUPER_ADMIN) {
                    checkRole.permissions = permissions
                    await this.roleRepository.save(checkRole)
                }
            }
        }
    }
}
