const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true, ref: 'Place' },
  user: { type: Schema.Types.ObjectId, required: true },
  bookingAt: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  citizen: { type: String, required: true },
  city: { type: String, required: true },
  price: Number,
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  });

const BookingModel = model('Booking', bookingSchema);

module.exports = BookingModel;