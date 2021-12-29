const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type: String,
        required : true
    },
    icon:{
        type: String,
        default:"icon"
    },
    color:{
        type: String,
        default :"color"
      
    }
})

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;