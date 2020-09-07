import {DefaultCrudRepository} from '@loopback/repository';
import {Contact, ContactRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContactRepository extends DefaultCrudRepository<
  Contact,
  typeof Contact.prototype.id,
  ContactRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Contact, dataSource);
  }
}
