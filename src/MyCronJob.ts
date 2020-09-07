import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import * as nodemailer from 'nodemailer';
import {ContactRepository} from './repositories';
import moment = require('moment');


const transporter = nodemailer.createTransport(
  `smtps://${process.env.GMAIL_USERNAME}:${process.env.GMAIL_PASSWORD}@smtp.gmail.com`
);


@cronJob()



export class MyCronJob extends CronJob {
  constructor(
    @repository(ContactRepository) public ContactRepository: ContactRepository,
  ) {
    super(
      {
        name: 'my-job',
        onTick: async () => {
          // do the work
          await this.performMyJob();
        },
        cronTime: '*/20 * * * *', // Every 20 min
        start: true,
      });
  }

  async performMyJob() {
    console.log("WELCOME cron job starting.....")

    let fromDate = moment().subtract(24, 'hours').utc().format("YYYY-MM-DD hh:mm a");

    console.log(fromDate);
    console.log("mysql host env===", process.env.MYSQL_HOST)
    const contacts = await this.ContactRepository.find({where: {is_notify: 0, created_at: {lte: new Date(fromDate)}}});

    for (let contact of contacts) {

      console.log(contact);

      let mailOptions = {
        from: `${process.env.GMAIL_USERNAME}`,
        to: contact['email'],
        subject: `Welcome to QSS TECH.`,
        text: `Hello ,${contact['fullname']} Welcome in Qss.`
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return console.log(`error: ${error}`);
        }
        await this.ContactRepository.updateAll({is_notify: 1}, {id: contact['id']});
        console.log(`Message Sent ${info.response}`);
      });

    }

    console.log("WELCOME cron job stopped")
  }
}

