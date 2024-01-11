const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const FileModel = mongoose.model('FileModel', fileSchema);

module.exports = FileModel;
