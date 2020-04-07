const bcrypt = require('bcryptjs');
const passport = require('passport');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
//home
app.get('/', (req, res)=>{
  const data = db.collection('shop').find({}).toArray((err, ashop) => {
    if (err){
      res.send({'error':'An error has occurred'});
    } else {
        ashop.reverse();
        res.render('welcome.ejs', { "shop": ashop ,"user":req.user })
    }
  });
});

//contact us
app.post('/', (req, res) => {
   const mail = { name: req.body.name, email: req.body.email, subject: req.body.subject, message: req.body.message, phone: req.body.phone };
    console.log(mail);
   db.collection('mail').insert(mail, (err, result) => {
     if (err) {
       res.send({ 'error': 'An error has occurred' });
     } else {

     }
  });
});


//showrooms
app.get('/showroom/:shopname',(req,res)=>{
  let shopname= {"shopname":req.params.shopname}
    db.collection('shop').findOne(shopname, (err, shop)=>{
      if(err){
        res.send({'error':'An error has occurred'});
      }else{

          const data = db.collection('dress').find(shopname).toArray((err, dress) => {
            if (err){
              res.send({'error':'An error has occurred'});
            } else {
                  dress.reverse();
              // res.send(units);
            res.render('limmys.ejs',{"shop": shop , "dress": dress });
            }
          });

      }
    });
 });


//shopnow
app.get('/shopnow', (req, res)=>{
  const data = db.collection('dress').find({}).toArray((err, shopnow) => {
    if (err){
      res.send({'error':'An error has occurred'});
    } else {
          shopnow.reverse();
      // res.send(units);
    res.render('shop-now.ejs',{"user":req.user, "dress": shopnow })
    }
  });
});

// add shop
 app.get('/shop',(req,res)=>{
    res.render('shop.ejs')
  })

 app.post('/shop', (req, res) => {
    const shop = { shopname: req.body.shopname, address: req.body.address, number: req.body.number, opentime: req.body.opentime,closetime: req.body.closetime,link: req.body.link};
    console.log(shop);
    db.collection('shop').insert(shop, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect('/shop')// res.send(result.ops[0]);

      }
    });
  });


//user model
const User = require('../models/User')

//register
app.get('/users/login',(req,res)=> res.render('login'))

//login
app.get('/users/register',(req,res)=> res.render('register'))

// Register
app.post('/users/register', (req, res) => {

  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {

        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                console.log(newUser);

                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
app.post('/users/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/shopnow',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//logout
app.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

//dress***************
app.get('/dress',(req,res)=>{
   res.render('dress.ejs')
 })


 app.post('/dress', (req, res) => {
    const dress = { dressname: req.body.dressname, price: req.body.price, type: req.body.type, size: req.body.size,shopname: req.body.shopname,link: req.body.link};
    console.log(dress);
    db.collection('dress').insert(dress, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect('/dress')// res.send(result.ops[0]);

      }
    });
  });



//order***************
app.get('/order',(req,res)=>{
   res.render('order.ejs')
 })


 app.post('/order-item', (req, res) => {
    const order = { name: req.body.name, email: req.body.email, address: req.body.address, city: req.body.city, phone: req.body.phone };
    console.log(order);
    db.collection('order').insert(order, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        // res.send(result.ops[0]);
        res.redirect('/thankyou')
      }
    });
  });

  //thankyou
app.get('/thankyou',(req, res)=>{
  res.render('thankyou.ejs')
})

//admin

app.get('/admin',(req,res)=>{
  res.render('admin.ejs')
})

//admin order
  app.get('/admin-order', (req, res)=>{
    const data = db.collection('order').find({}).toArray((err, aorder) => {
      if (err){
        res.send({'error':'An error has occurred'});
      } else {
          aorder.reverse();
        // res.send(units);
        res.render('a-order.ejs', { "order": aorder })
      }
    });
  });

//admin user
  app.get('/admin-user', (req, res)=>{
    const data = db.collection('users').find({}).toArray((err, auser) => {
      if (err){
        res.send({'error':'An error has occurred'});
      } else {
          auser.reverse();
        // res.send(units);
        res.render('a-user.ejs', { "user": auser })
      }
    });
  });

//admin contact us
app.get('/admin-mail', (req, res)=>{
  const data = db.collection('mail').find({}).toArray((err, amail) => {
    if (err){
      res.send({'error':'An error has occurred'});
    } else {
        amail.reverse();
      // res.send(units);
      res.render('a-mail.ejs', { "mail": amail })
    }
  });
});

//dress Details
app.get('/admin-dress', (req, res)=>{
  const data = db.collection('dress').find({}).toArray((err, adress) => {
    if (err){
      res.send({'error':'An error has occurred'});
    } else {
        adress.reverse();
      // res.send(units);
      res.render('a-dress.ejs', { "dress": adress })
    }
  });
});


  //shop Details
  app.get('/admin-shop', (req, res)=>{
    const data = db.collection('shop').find({}).toArray((err, ashop) => {
      if (err){
        res.send({'error':'An error has occurred'});
      } else {
          ashop.reverse();
        // res.send(units);
        res.render('a-shop.ejs', { "shop": ashop })
      }
    });
  });

  app.get('/checkout',(req, res)=>{
      res.render('checkout',{user:req.user})
    })

    app.post('/checkout', (req,res)=>{
    let cart = req.user.mycart;
    db.collection('checkoutOrder').insertOne({user:req.user.name, email: req.user.email, address: req.body.address, city: req.body.city, phone:req.body.phone, 'order':cart},(err, order)=>{
      if (err){
        console.log(err);
      } else {
        db.collection('users').updateOne({'_id': ObjectID(req.user.id)},{$unset:{'mycart':''}})
        res.redirect('/mycart')
      }
    })
    console.log(cart);
  })

  //user profile
  app.get('/userprofile', (req, res) => {
      res.render('userprofile.ejs', { "user": req.user })
  })


};
