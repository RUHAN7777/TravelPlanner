const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: String,
  type: String,
  status: String
}, { _id: false });

const destinationSchema = new mongoose.Schema({
  city: String,
  country: String,
  arrivalDate: Date,
  departureDate: Date,
  activities: [activitySchema]
}, { _id: false });

const fileSchema = new mongoose.Schema({
  originalName: String,
  mimeType: String,
  data: Buffer
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
  tripName: String,
  startDate: Date,
  endDate: Date,
  destinations: [destinationSchema],
  files: [fileSchema]
});

module.exports = mongoose.model('Trip', tripSchema);
