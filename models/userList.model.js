  
const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
   item: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "free"
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const List = mongoose.model("List", userSchema);
module.exports = List;