const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app  = express();

//template engine set-up
app.engine('handlebars' , exphbs());
app.set('view engine' , 'handlebars');

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use('/public',express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  res.render('contact');
});

app.post('/send' , (req,res) => {
  const output = `
  <p>You have a new Message</p>
  <h3>Details</h3>
  <ul>
    <li>Name : ${req.body.name}</li>
    <li>Company : ${req.body.company}</li>
    <li>Email : ${req.body.email}</li>
    <li>Phone : ${req.body.phone} </li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `;
  let transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : '465',
      auth: {
          user: '****@gmail.com', // generated ethereal user
          pass: '****' // generated ethereal password
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"your name" <****@gmail.com>', // sender address
      to: '****@gmail.com', // list of receivers
      subject: '***', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('contact' , {msg:'Email has been sent'});
  });


});

app.listen(3000,() => {
  console.log('Server started...');
});
