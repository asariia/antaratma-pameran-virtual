const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const placeSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  address: { type: String, required: true },
  online: { type: Boolean, default: false },
  photos360: { type: [String], required: false },
  smallPhotos360: { type: [String], required: false },
  tumbnail: { type: String, required: true },
  photos: { type: [String], required: true },
  description: { type: String, required: true },
  simpleText: String,
  maxGuests: { type: Number, required: true },
  price: { type: Number, required: true },
});

const PlaceModel = model('Place', placeSchema);

module.exports = PlaceModel;