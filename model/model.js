const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// MongoDB connection
const url = process.env.MONGO_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Define your schemas with lowercase field names
const schema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Email: {
    type: String,
    unique: true,
  },
  Password: {
    type: String,
  },
});

const carSchema = new mongoose.Schema({
  carId: {
    type: String,
    required: true,
  },
  carName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const bikeSchema = new mongoose.Schema({
  bikeId: {
    type: String,
    required: true,
  },
  bikeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Define the CarBooking schema
const carBookingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  carId: {
    type: String,
    ref: 'Car',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  // Add more features as needed
});

// Define the BikeBooking schema
const bikeBookingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  bikeId: {
    type: String,
    ref: 'Bike',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  // Add more features as needed
});

// Create models
const model = mongoose.model("Emails", schema, "tokens");
const CarModel = mongoose.model("Car", carSchema);
const BikeModel = mongoose.model("Bike", bikeSchema);
const CarBooking = mongoose.model('CarBooking', carBookingSchema);
const BikeBooking = mongoose.model('BikeBooking', bikeBookingSchema);

// Create and save cars
const newCars = [
  {
    carId: "12345",
    carName: "Washing Machine",
    description: "A Handle with care",
  },
  {
    carId: "12346",
    carName: "cycle",
    description: "A Handle with care",
  },
  {
    carId: "12347",
    carName: "battery",
    description: "A Handle with care",
  },
  {
    carId: "12348",
    carName: "chair",
    description: "A Handle with care",
  },
  {
    carId: "12349",
    carName: "table",
    description: "A Handle with care",
  },
  {
    carId: "12350",
    carName: "bike",
    description: "A Handle with care",
  },
];

CarModel.insertMany(newCars)
  .then((cars) => {
    console.log("Cars created:", cars);
  })
  .catch((error) => {
    console.error("Error creating cars:", error);
  });

// Create and save multiple bikes
const newBikes = [
  {
    bikeId: "67891",
    bikeName: "TV",
    description: "Handle with care ",
  },
  {
    bikeId: "67892",
    bikeName: "Mouse",
    description: "Handle with care",
  },
  {
    bikeId: "67893",
    bikeName: "Laptop",
    description: "Handle with care",
  },
  {
    bikeId: "67894",
    bikeName: "mobile",
    description: "Handle with care ",
  },
  {
    bikeId: "67895",
    bikeName: "video Came",
    description: "Handle with care ",
  },
  {
    bikeId: "67896",
    bikeName: "Mobile Stand ",
    description: "Handle with care ",
  },
  {
    bikeId: "67897",
    bikeName: "truck",
    description: "Handle with care ",
  },
  {
    bikeId: "67898",
    bikeName: "cycle",
    description: "Handle with care ",
  },
  {
    bikeId: "67899",
    bikeName: "Party Hall",
    description: "Handle with care ",
  },
  {
    bikeId: "678912",
    bikeName: "book",
    description: "Handle with care ",
  },
  // ... add more bikes here
];

BikeModel.insertMany(newBikes)
  .then((bikes) => {
    console.log("Bikes created:", bikes);
  })
  .catch((error) => {
    console.error("Error creating bikes:", error);
  });

// Retrieve cars
CarModel.find()
  .then((cars) => {
    console.log("All cars:", cars);
  })
  .catch((error) => {
    console.error("Error retrieving cars:", error);
  });

// Retrieve bikes
BikeModel.find()
  .then((bikes) => {
    console.log("All bikes:", bikes);
  })
  .catch((error) => {
    console.error("Error retrieving bikes:", error);
  });

module.exports = { model, CarModel, BikeModel, CarBooking, BikeBooking };
