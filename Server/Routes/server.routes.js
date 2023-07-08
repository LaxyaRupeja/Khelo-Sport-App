const express = require('express');
const router = express.Router();
const User = require("../Models/user.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Event = require('../Models/event.model');
const authMiddleware = require('../Middleware/authMiddleWare');

require('dotenv').config();
// Authentication Routes
router.get("/", (req, res) => {
    res.send("Welcome to My Khelo-Sport-app")
})
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role) {
            const user = new User({ username, password: hashedPassword, role: role });
            await user.save();
            res.status(201).json(user);
        }
        else {
            const user = new User({ username, password: hashedPassword });
            await user.save();
            res.status(201).json(user);
        }


    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});
router.get('/users', authMiddleware.authenticate, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
});

// router.get('/users/:userId', async (req, res) => {
//     const { userId } = req.params;
//     try {
//         const user = await User.findById(userId)
//             .populate('requestedEvents')
//             .populate('joinedEvents');
//         if (!user) {
//             res.status(404).json({ error: 'User not found' });
//             return;
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Error retrieving user:', error);
//         res.status(500).json({ error: 'Error retrieving user' });
//     }
// });

router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { username, password },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});
router.get('/users/me', authMiddleware.authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId)
            .populate('requestedEvents')
            .populate('joinedEvents');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Error retrieving user' });
    }
});

// Event Routes
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error('Error retrieving events:', error);
        res.status(500).json({ error: 'Error retrieving events' });
    }
});

router.get('/events/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId).populate("requests");
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(event)
    } catch (error) {
        console.error('Error retrieving event:', error);
        res.status(500).json({ error: 'Error retrieving event' });
    }
});

router.post('/events', authMiddleware.authenticate, async (req, res) => {
    const { title, description, timings, playerLimit } = req.body;
    try {
        const event = new Event({ title, description, timings, playerLimit, organizer: req.userData.userId });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event' });
    }
});

router.put('/events/:eventId', authMiddleware.authenticate, async (req, res) => {
    const { eventId } = req.params;
    const { title, description, timings, playerLimit } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(
            eventId,
            { title, description, timings, playerLimit },
            { new: true }
        );
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Error updating event' });
    }
});

router.delete('/events/:eventId', authMiddleware.authenticate, async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Error deleting event' });
    }
});

router.get('/events/:eventId/players', async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId).populate('players');
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        console.error('Error retrieving event players:', error);
        res.status(500).json({ error: 'Error retrieving event players' });
    }
});
router.get('/events/:eventId/requests', async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId).populate('requests');
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        console.error('Error retrieving event requests:', error);
        res.status(500).json({ error: 'Error retrieving event requests' });
    }
});

router.post('/events/:eventId/players', authMiddleware.authenticate, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.userData.userId;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Check if the player limit is reached
        if (event.players.length >= event.playerLimit) {
            res.status(400).json({ error: 'Event is already full' });
            return;
        }

        // Check if the user has already joined the event
        if (event.players.includes(userId)) {
            res.status(401).json({ error: 'User has already joined the event' });
            return;
        }

        // Check if the user has already requested to join the event
        if (event.requests.includes(userId)) {
            res.status(400).json({ error: 'User has already requested to join the event' });
            return;
        }
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.requestedEvents.push(eventId);
        await user.save();

        // Add the user to the event's requests array
        event.requests.push(userId);
        await event.save();

        res.json(event);
    } catch (error) {
        console.error('Error requesting to join event:', error);
        res.status(500).json({ error: 'Error requesting to join event' });
    }
});

router.put('/events/:eventId/requests/:userId/accept', authMiddleware.authenticate, async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Check if the user has requested to join the event
        if (!event.requests.includes(userId)) {
            res.status(400).json({ error: 'User has not requested to join the event' });
            return;
        }

        // Remove the user from the requests array
        event.requests.pull(userId);

        // Add the user to the players array
        event.players.push(userId);

        await event.save();

        // Update the user's joinedEvents array with the event ID
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.joinedEvents.push(eventId);
        await user.save();

        res.json(event);
    } catch (error) {
        console.error('Error accepting player request:', error);
        res.status(500).json({ error: 'Error accepting player request' });
    }
});

router.put('/events/:eventId/requests/:userId/reject', authMiddleware.authenticate, async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Check if the user has requested to join the event
        if (!event.requests.includes(userId)) {
            res.status(400).json({ error: 'User has not requested to join the event' });
            return;
        }

        // Remove the user from the requests array
        event.requests.pull(userId);
        await event.save();

        // Update the user's requestedEvents array by removing the event ID
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.requestedEvents.pull(eventId);
        await user.save();

        res.json(event);
    } catch (error) {
        console.error('Error rejecting player request:', error);
        res.status(500).json({ error: 'Error rejecting player request' });
    }
});
router.get("/event/organizer", authMiddleware.authenticate, async (req, res) => {
    const OrgUserID = req.userData.userId;
    const userData = await User.findById(OrgUserID);
    if (userData.role != "organizer") {
        res.status(404).json({ error: 'User not Authorized' });
        return;
    }
    let AllHostEvents = await Event.find({ organizer: OrgUserID }).populate("requests");
    res.json({ AllHostEvents });
})

module.exports = router;
