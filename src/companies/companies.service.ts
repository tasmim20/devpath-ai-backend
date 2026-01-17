import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async findAll() {
    // 'companies' is your collection name in MongoDB
    return this.connection.collection('companies').find().toArray();
  }
}
