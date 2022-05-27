//Set up mongoose connection
require("dotenv").config();
const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const resourceSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
          v
        ),
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  short_url: Number,
});

// change id from idObject to simple string number
// resourceSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = mongoose.model("Resource", resourceSchema);
