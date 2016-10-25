const express = require('express'),
      morgan = require('morgan'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      pug = require('pug');

var app = express(),
    transporter = nodemailer.createTransport(
      'smtps://' + process.env.PERSONAL_WEBSITE_EMAIL_ADDRESS + ':' +
      process.env.PERSONAL_WEBSITE_EMAIL_PASSWORD + '@smtp.gmail.com'
    );

// THIS APPLICATION CONFIGURATION IS NECESSARY TO USE response.render inside route handlers/controllers
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', (request, response) => {
  // by default response.render looks up files inside /views folder
  response.render('index');
});

app.get('/contact', (request, response) => {
  response.render('contact');
});

app.post('/send-email', (request, response) => {
  console.log('HTTP Request body was:');
  console.log(request.body);

  transporter.sendMail({
    from: request.body.emailAddress,
    to: process.env.PERSONAL_WEBSITE_EMAIL_ADDRESS,
    subject: 'Email received from Personal Website',
    text: request.body.content + '\n\nSender Email: ' +
    request.body.emailAddress  + '\nSender Full Name: ' + request.body.fullName
  }, (error, info) => {
    if (error) {
      return console.log(error);
    }

    console.log('Message sent: ' + info.response);
  });

  response.redirect('/');
});

app.listen(3000, () => {
  console.log('Web server started on port 3000');
});
