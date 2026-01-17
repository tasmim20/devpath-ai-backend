import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('companies')
export class CompaniesController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  async getAllCompanies() {
    if (!this.connection?.db) {
      throw new InternalServerErrorException('Database connection not ready');
    }

    const companies = await this.connection.db
      .collection('companies')
      .find()
      .toArray();

    return companies;
  }
}
