const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
  },
  profilePic: String,
  phone: { type: String, default: '' },
  role: { type: String, default: 'client' }
});


const UserModel = model('User', UserSchema);

module.exports = UserModel;
