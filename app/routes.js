module.exports = function (app, passport, db) {
    var ObjectId = require("mongodb").ObjectId

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', function (req, res) {
        const defaultResult = [{
            value: 0,
            wins: 0,
            loss: 0,
            moneyWon: 0,
            moneyLoss: 0,
        }]
        db.collection('Roulette').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs', {
                user: req.user,
                messages: result || defaultResult
            })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // message board routes ===============================================================

    app.post('/profile', (req, res) => {
        console.log(req.body)
        db.collection('Roulette').save({
            value: Number(req.body.Revenue),
            wins: Number(0), loss: Number(0), moneyWon: Number(0), moneyLoss: Number(0)
        }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/profile')
        })
    })

    app.put('/updateGame', (req, res) => {
        console.log(req.body)
        let random = Math.ceil(Math.random() * 37)
        if (random === 1 && req.body.color === 'green') {
            db.collection('Roulette')
                .findOneAndUpdate({},
                    {
                        $inc: {
                            value: req.body.amount * -35,
                            loss: 1,
                            moneyLoss: req.body.amount * -35,

                        }
                    }, {
                    sort: { _id: -1 },
                    upsert: true

                }, (err, result) => {
                    result = {
                        WinCheck: "greenWinner"
                    }

                    if (err) return res.send(err)
                    res.send(result)
                })

        }
        else if (random >= 2 && random <= 19 && req.body.color === 'black' || random > 19 && req.body.color === 'red') {
            db.collection('Roulette')
                .findOneAndUpdate({},
                    {
                        $inc: {
                            value: req.body.amount * -2,
                            loss: 1,
                            moneyLoss: req.body.amount * -2,

                        }
                    }, {
                    sort: { _id: -1 },
                    upsert: true

                }, (err, result) => {
                    result = {
                        WinCheck: "blackWinner"
                    }

                    if (err) return res.send(err)
                    res.send(result)
                })



        }
        else {
            db.collection('Roulette')
                .findOneAndUpdate({},
                    {
                        $inc: {
                            value: req.body.amount,
                            wins: 1,
                            moneyWon: req.body.amount,

                        }
                    }, {
                    sort: { _id: -1 },
                    upsert: true

                }, (err, result) => {
                    result = {
                        WinCheck: "Loser"
                    }

                    if (err) return res.send(err)
                    res.send(result)
                })
        }
    })


    app.delete('/reset', (req, res) => {
        console.log("Nice we deleted it")
        db.collection('Roulette').deleteMany({}, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Data deleted!')
        })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
