var configView = require('./config/view');
var User = require('./models/user');
module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index', { config: configView, user: req.user });
    });

    require('./routes/auth')(app, passport);
    
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', { config: configView, user: req.user });
    });

    require('./routes/games')(app);
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
