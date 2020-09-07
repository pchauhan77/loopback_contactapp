import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'contacts',
  settings: {
    hiddenProperties: ['created_at']
  }
})
export class Contact extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  fullname: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  mobile: string;

  @property({
    type: 'string',
    default: null,
  })
  address?: string;

  @property({
    type: 'date',
    required: false,
  })
  created_at: Date;

  @property({
    type: 'number',
    required: false,
  })
  is_notify: number;


  constructor(data?: Partial<Contact>) {
    super(data);
  }
}

export interface ContactRelations {
  // describe navigational properties here
}

export type ContactWithRelations = Contact & ContactRelations;
