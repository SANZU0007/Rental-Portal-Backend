
const express = require("express");
const { model, CarModel, BikeModel,  CarBooking, BikeBooking } = require('../model/model'); // Update the path accordingly

const bcrypt = require("bcrypt");
const generateToken = require("../GenToken");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const shortid = require("shortid");

router.get("/users", async (req, res) => {
  const user = await model.find();
  if (!user) {
    return res.status(404).json({ message: "not found" });
  }
  res.status(200).json(user);
});

router.post("/signup", async (req, res) => {
  const { Name, Email, Password } = req.body;
  const user = await model.findOne({ Email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new model({ Name, Email, Password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: "user Created" });
  }
  res.status(404).json({ message: "user Already exist" });
});


router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await model.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordValidate = await bcrypt.compare(Password, user.Password);

    if (!passwordValidate) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});


router.post("/resetpassword", async (req, res) => {
  const { Email } = req.body;
  const user = await model.findOne({ Email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = jwt.sign({ Id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  // Send reset token via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.Email,
    subject: "Password Reset",
    html: `
      <p>Hi ${user.Name},
      please click this <a href="https://resplendent-capybara-108deb.netlify.app/${resetToken}">link</a> to change your password.</p>
      <p>There was a request to change your password!</p>
      <p>If you did not make this request, please ignore this email.</p>
      <p>Otherwise, </p>
    `,
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).json({ message: "Error sending email" });
    }
    console.log("Reset token email sent:", info.response);
    res.status(200).json({ message: "Password reset token sent", resetToken });
  });
});

router.post("/savepassword", async (req, res) => {
  const { NewPassword, resetToken } = req.body;
  
  // const secretKey = '123456789101112';

  

  // Verify reset token
  try {
    const decoded = jwt.verify(resetToken,process.env.SECRET_KEY );

    const userId = decoded.Id;
    const user = await model.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
    user.Password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error verifying reset token:", error);
    res.status(400).json({ message: "Invalid reset token" });
  }
});



  
router.get('/api/cars', async (req, res) => {
    try {
      const cars = await CarModel.find();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/bikes', async (req, res) => {
    try {
      const bikes = await BikeModel.find();
      res.json(bikes);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });




  router.post('/bookingsBike', async (req, res) => {
    try {
      // Extract the data from the request body
      const { user, bikeId, bookingDate, returnDate } = req.body;
  
      // Check if the provided bikeId exists in the 'Bike' collection
      const bike = await BikeModel.findOne({ bikeId: bikeId });
  
      if (!bike) {
        return res.status(404).json({ message: 'Bike not found' });
      }
  
      // Create a new bike booking instance
      const newBooking = new BikeBooking({
        user,
        bikeId,
        bookingDate,
        returnDate,
        // Add more features here as needed
      });
  
      // Save the booking to the database
      await newBooking.save();
  
      res.status(201).json(newBooking); // Return the created booking as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating a bike booking' });
    }
  });
  
// D// Define the POST route to create a new car booking
router.post('/bookingsCar', async (req, res) => {
  try {
    // Extract the data from the request body
    const { user, carId, bookingDate, returnDate } = req.body;

    // Check if the provided carId exists in the 'carModel' collection
    const car = await CarModel.findOne({ carId: carId });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Create a new car booking instance
    const newBookingTwo = new CarBooking({
      user,
      carId,
      bookingDate,
      returnDate,
      // Add more features here as needed
    });

    // Save the booking to the database
    await newBookingTwo.save();

    res.status(201).json(newBookingTwo); // Return the created booking as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating a car booking' });
  }
});


  
















module.exports = router;