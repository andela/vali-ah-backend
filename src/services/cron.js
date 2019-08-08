import cron from 'node-cron';

import notification from './notification';

cron.schedule('* */6 * * *', notification.sendBatch());
