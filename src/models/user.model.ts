import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'users',
  settings: {
    hiddenProperties: ['password', 'created_at']
  }
})
export class User extends Entity {
  @property({
    type: 'Number',
    id: true,
    generated: false,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'date',
    required: false,
  })
  created_at: Date;


  constructor(data?: Partial<User>) {
    super(data);
  }


}



export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
