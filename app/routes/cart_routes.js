var ObjectID = require('mongodb').ObjectID;


module.exports = function (app,db){
  app.post('/add_to_cart', (req, res) => {
    var id = ObjectID(req.body.c_id);
    var mycart;
    db.collection('dress').findOne({'_id':id}, (err, dress)=>{
      mycart = dress;
      db.collection('users').updateOne({ '_id':ObjectID(req.user._id)}, { $push: { mycart } }, (err, post) => {
      if (err) {
        res.send(err);
      }else {
        res.status(200).send('OK');
      }
    });
  })
  })

  app.get('/mycart',isLoggedIn ,(req,res)=>{
    // res.render('cart.ejs',{user:req.user})
    res.render('cart', {user:req.user})
  })

app.post('/delete/cart',(req,res)=>{
  let id = ObjectID(req.body.id);
  db.collection('users').updateOne({ '_id': ObjectID(req.user._id) }, { $pull: { "mycart": { '_id': id } } }, (error, post) => {
    res.redirect('/mycart')
  })
})


}
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
