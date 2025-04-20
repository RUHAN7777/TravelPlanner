const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Trip = require('./models/Trip');
const User = require('./models/User');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } }); // Max 15MB
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('./authMiddlewear'); // Import middleware

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const uri = 'mongodb+srv://Ruhan:hT_spSUNF9rHvx5@cluster0.eahkrs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected 🚀'))
  .catch(err => console.log(err));

// ✅ Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Authorization' header
  
  if (!token) return res.status(403).json({ message: 'Access denied, token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ✅ Root test route
app.get('/', (req, res) => res.send('Travel Itinerary API is running!'));

// ✅ Create new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ message: "User created 👤", user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
});

// ✅ User Login (Generate JWT token)
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({ 
      message: "Login successful 🎉", 
      user: { id: user._id, name: user.name, email: user.email }, 
      token: token // Send the token to the client
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});


// ✅ Create new trip (Protected route)
app.post('/trips', authMiddleware, async (req, res) => {
  try {
    console.log('🧑 User from token:', req.user);
    const userId = req.user._id; // Get userId from the token
    const newTrip = new Trip({
      ...req.body,
      userId: userId // Set the userId to the logged-in user's ID
    });
    await newTrip.save();

    res.status(201).json({ message: 'Trip created successfully 🧳', trip: newTrip });
  } catch (error) {
    console.error('❌ Error creating trip:', error.stack);
    res.status(500).json({ error: 'Failed to create trip', details: error.message });
  }
});

// Upload a file to a trip (Protected route)
app.post('/trips/:tripId/upload-file', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const file = {
      originalName: req.file.originalname,  // Change filename to originalName
      mimeType: req.file.mimetype,          // Change contentType to mimeType
      data: req.file.buffer
    };

    // Save file under the trip document
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      { $push: { files: file } },
      { new: true }
    );

    res.json({ message: "File uploaded successfully 📎", trip: updatedTrip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File upload failed" });
  }
});



app.get('/trips/:tripId/files/:filename', async (req, res) => {
  try {
    const { tripId, filename } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const file = trip.files.find(f => f.originalName === filename);
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `inline; filename="${file.originalName}"`
    });

    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch file' });
  }
});

// ✅ Get unique trips (optional)

app.get('/trips', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching trips for user:", userId); // debug log

    const trips = await Trip.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.status(200).json(trips);
  } catch (error) {
    console.error('❌ Error fetching user trips:', error);
    res.status(500).json({ error: "Failed to fetch user trips" });
  }
});

// ✅ Get trips by destination city
app.get('/trips/destination/:city', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const trips = await Trip.find({
      "destinations.city": req.params.city,
      userId: userId
    }).populate('userId', 'name');

    const enrichedTrips = trips.map(trip => {
      const tripObj = trip.toObject();
      tripObj.userName = trip.userId?.name || 'Unknown';
      return tripObj;
    });

    res.json(enrichedTrips);
  } catch (err) {
    res.status(500).json({ error: 'Error finding by destination' });
  }
});


// ✅ Get trips by date range
app.get('/trips/dates/:start/:end', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { start, end } = req.params;
    const trips = await Trip.find({
      startDate: { $gte: new Date(start) },
      endDate: { $lte: new Date(end) },
      userId: userId
    }).populate('userId', 'name');

    const enrichedTrips = trips.map(trip => {
      const tripObj = trip.toObject();
      tripObj.userName = trip.userId?.name || 'Unknown';
      return tripObj;
    });

    res.json(enrichedTrips);
  } catch (err) {
    res.status(500).json({ error: 'Error finding by date range' });
  }
});

// ✅ Update activity status in a trip
app.put('/trips/:tripId/update-activity', authMiddleware, async (req, res) => {
  try {
    const { city, activityName, newStatus } = req.body;

    const updated = await Trip.updateOne(
      { _id: req.params.tripId },
      {
        $set: {
          "destinations.$[dest].activities.$[act].status": newStatus
        }
      },
      {
        arrayFilters: [
          { "dest.city": city },
          { "act.name": activityName }
        ]
      }
    );

    res.json({ message: "Activity updated ✅", result: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update activity" });
  }
});

// ✅ Analytics: Most visited cities
app.get('/analytics/most-visited-cities', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Trip.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$destinations" },
      {
        $group: {
          _id: "$destinations.city",  // Group by city name
          visitCount: { $sum: 1 }     // Count each appearance
        }
      },
      { $sort: { visitCount: -1 } }
    ]);

    // If city name (_id) is null or missing, we guard against it:
    const formattedResult = result.map(item => ({
      city: item._id || "Unknown",
      visits: item.visitCount || 0
    }));

    res.json({ mostVisitedCities: formattedResult });

  } catch (err) {
    console.error("Error in analytics route:", err);
    res.status(500).json({ error: "Failed to aggregate cities" });
  }
});




// ✅ Analytics: Most popular activities
app.get('/analytics/most-popular-activities', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Trip.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$destinations" },
      { $unwind: "$destinations.activities" },
      {
        $group: {
          _id: "$destinations.activities.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ mostPopularActivities: result.map(item => ({ activity: item._id, count: item.count })) });

  } catch (err) {
    res.status(500).json({ error: "Failed to aggregate activities" });
  }
});



// ✅ Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000 🌍');
});
