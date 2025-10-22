import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line } from './entities/line.entity';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';

@Injectable()
export class LineRepository {
    constructor(
        @InjectRepository(Line)
        private readonly repository: Repository<Line>
    ) {}

    async create(createLineDto: CreateLineDto): Promise<Line> {
        const line = this.repository.create(createLineDto);
        return await this.repository.save(line);
    }

    async findAll(): Promise<Line[]> {
        return await this.repository.find({
            relations: ['brand'],
            order: { name: 'ASC' },
        });
    }

    async findAllActive(): Promise<Line[]> {
        return await this.repository.find({
            where: { isActive: true },
            relations: ['brand'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Line> {
        const line = await this.repository.findOne({
            where: { id },
            relations: ['brand'],
        });

        if (!line) {
            throw new NotFoundException(`Línea con ID ${id} no encontrada`);
        }

        return line;
    }

    async findByName(name: string): Promise<Line | null> {
        return await this.repository.findOne({
            where: { name },
        });
    }

    async update(id: number, updateLineDto: UpdateLineDto): Promise<Line> {
        const line = await this.findOne(id);

        Object.assign(line, updateLineDto);
        return await this.repository.save(line);
    }

    async remove(id: number): Promise<void> {
        const line = await this.findOne(id);
        await this.repository.remove(line);
    }

    async softDelete(id: number): Promise<Line> {
        const line = await this.findOne(id);
        line.isActive = false;
        return await this.repository.save(line);
    }

    async restore(id: number): Promise<Line> {
        const line = await this.findOne(id);
        line.isActive = true;
        return await this.repository.save(line);
    }

    async exists(id: number): Promise<boolean> {
        const count = await this.repository.count({
            where: { id },
        });
        return count > 0;
    }

    async existsByName(name: string, excludeId?: number): Promise<boolean> {
        const query = this.repository
            .createQueryBuilder('line')
            .where('line.name = :name', { name });

        if (excludeId) {
            query.andWhere('line.id != :excludeId', { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }
}
