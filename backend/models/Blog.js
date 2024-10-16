const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const blogSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  photos: [String],
  description: String,
});

const BlogModel = model('Blog', blogSchema);

module.exports = BlogModel;