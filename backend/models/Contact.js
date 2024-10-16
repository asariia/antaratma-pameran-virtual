const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '+62' },
  message: { type: String, default: 'client' }
});


const ContactModel = model('Contact', ContactSchema);

module.exports = ContactModel;
