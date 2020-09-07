
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,

  UserServiceBindings
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MysqlDataSource} from './datasources';
import {MyCronJob} from './MyCronJob';
import {MySequence} from './sequence';

export {ApplicationConfig};



export class QssBackendAssignmentApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.component(CronComponent);
    this.add(createBindingFromClass(MyCronJob));
    this.sequence(MySequence);
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MysqlDataSource, UserServiceBindings.DATASOURCE_NAME);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
