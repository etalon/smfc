var express = require('express');
var flash = require('req-flash');

var router = express.Router();

express.use(flash());

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'SMFC'
    });
});

module.exports = router;

var mongoose = require('mongoose');
var SupermarketGroup = mongoose.model('SupermarketGroup');

router.get('/supermarketgroups', function (req, res, next) {

    SupermarketGroup.find(function (err, supermarketgroups) {

        if (err) {
            return next(err);
        }

        res.json(supermarketgroups);
    });
});

router.post('/supermarketgroups', function (req, res, next) {
    var supermarketgroup = new SupermarketGroup(req.body);

    supermarketgroup.save(function (err, supermarketgroup) {

        if (!err) {
            res.json(supermarketgroup);
            return;
        }
        
        switch (err.code) {
            case 11000:
               console.log(err);
                req.flash('error', 'User already exists');
               
                break;
            default:
                return next(err);
        }

    });
});

router.param('supermarketgroup', function (req, res, next, id) {
    var query = SupermarketGroup.findById(id);

    query.exec(function (err, supermarketgroup) {
        if (err) {
            return next(err);
        }
        if (!supermarketgroup) {
            return next(new Error('can\'t find supermarketgroup'));
        }

        req.supermarketgroup = supermarketgroup;
        return next();
    });
});

router.get('/supermarketgroups/:supermarketgroup', function (req, res) {
    res.json(req.supermarketgroup);
});

router.delete('/supermarketgroups/:supermarketgroup', function (req, res, next) {
    req.supermarketgroup.remove();
    res.json(req.supermarketgroup);
});