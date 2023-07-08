// Event Model

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timings: {
        type: Date,
        required: true,
    },
    playerLimit: {
        type: Number,
        required: true,
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
