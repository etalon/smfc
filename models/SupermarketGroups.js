var mongoose = require('mongoose');

var SupermarketGroupSchema = new mongoose.Schema({
    name: {
        type: String
        , required: true
        , unique: true
    , }
});

mongoose.model('SupermarketGroup', SupermarketGroupSchema);
