import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IpRecord } from "src/ip-tracker/entities/ip-record.entity";
import { Repository } from "typeorm";

@Injectable()
export class Cleanup {
    constructor(
        @InjectRepository(IpRecord) private readonly ipRepository: Repository<IpRecord>
    ) { }

    async cleanOtp() {
        const records = await this.ipRepository.find()
        for (const record of records) {
            if (record?.blockUntil && record.blockUntil < new Date()) {
                await this.ipRepository.delete({ id: record.id })
            }
        }
    }
}