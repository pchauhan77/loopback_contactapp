import {authenticate, TokenService} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,

  UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Filter,

  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors, param,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {compare, hash} from 'bcryptjs';
import {promisify} from 'util';
import {User} from '../models';
import {UserRepository as userRepo} from '../repositories';

export class UserController {
  private hashAsync = promisify(hash);
  private compareSync = promisify(hash);

  constructor(

    @repository(userRepo)
    public userRepo: userRepo,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/users', {


    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {

    user['created_at'] = new Date();
    user['password'] = await this.hashAsync(user.password, 10);
    console.log(user);
    return this.userRepo.create(user);
  }



  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<{token: string}> {


    const foundUser = await this.userRepo.findOne({
      where: {
        email: user.email
      }
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound('user not found');
    }

    const passwordMatches = await compare(user.password, foundUser.password);
    console.log(foundUser);
    console.log(passwordMatches);
    if (!passwordMatches) {
      throw new HttpErrors.Unauthorized('password is not valid');
    }

    //const userData = await this.userService.verifyCredentials(user);
    // console.log("user", user);
    const userProfile = {
      [securityId]: foundUser.id!.toString(),
      id: foundUser.id,
      email: foundUser.email
    };;

    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token: token})
  }


  @authenticate("jwt")
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    console.log(filter);
    return this.userRepo.find(filter);
  }
}


