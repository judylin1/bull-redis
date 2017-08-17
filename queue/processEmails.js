'use strict';

const Queue = require('bull');

// connect to Redis
const emailsQueue = Queue('emails', 6379, '127.0.0.1');

// process queue
emailsQueue.process((job, done) => {
  // force every odd job to fail to test failure handling
  if (job.data.index % 2 === 0) {
    console.log(`Fired email - ${job.data.index}`);
  } else {
    throw new Error('Forced fail');
  }
  done();
});

emailsQueue.on('failed', (job, err) => {
  // Job failed with reason err
  console.log(`Email with index ${job.data.index} failed: `, err);
  console.log(`Attempts made: ${job.attemptsMade}`);
  console.log(`Last attempt - ${(job.attemptsMade === job.opts.attempts)}`);
})

emailsQueue.resume();

setInterval(function () {
  // this adds the job to the Redis queue
  process.exit(200)
}, 3000);
