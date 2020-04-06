const noteRoutes = require('./note_routes');
const cartRoutes = require('./cart_routes')
module.exports = function(app, db) {
 noteRoutes(app, db);
 cartRoutes(app,db)
 // Other route groups could go here, in the future
};
