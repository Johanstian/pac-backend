const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const retestsSchema = new Schema(
    {
        cc: {
            type: String,
            required: [true, 'User name is required'],
            unique: true,
        },
        names: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        academicTitle: {
            type: String,
            required: [true, 'is required'],
        },
        complement: {
            type: String,
            required: [true, 'is required'],
        },
        experienceWork: {
            type: String,
            required: [true, 'is required'],
        },
        cc1: {
            type: Number,
            required: [true, 'is required'],
        },
        cc2: {
            type: Number,
            required: [true, 'is required'],
        },
        cc3: {
            type: Number,
            required: [true, 'is required'],
        },
        cc4: {
            type: Number,
            required: [true, 'is required'],
        },
        cc5: {
            type: Number,
            required: [true, 'is required'],
        },
        cc6: {
            type: Number,
            required: [true, 'is required'],
        },
        ce1: {
            type: Number,
            required: [true, 'is required'],
        },
        ce2: {
            type: Number,
            required: [true, 'is required'],
        },
        ce3: {
            type: Number,
            required: [true, 'is required'],
        },
        ce4: {
            type: Number,
            required: [true, 'is required'],
        },
        ce5: {
            type: Number,
            required: [true, 'is required'],
        },
        ce6: {
            type: Number,
            required: [true, 'is required'],
        },
        ce7: {
            type: Number,
            required: [true, 'is required'],
        },
        ce8: {
            type: Number,
        },
        tm1: {
            type: String,
            required: [true, 'is required'],
        },
        tm2: {
            type: String,
            required: [true, 'is required'],
        },
        tm3: {
            type: String,
            required: [true, 'is required'],
        },
        tm4: {
            type: String,
            required: [true, 'is required'],
        },
        tm5: {
            type: String,
            required: [true, 'is required'],
        },
        tm6: {
            type: String,
            required: [true, 'is required'],
        },
        tm7: {
            type: String,
            required: [true, 'is required'],
        },
        tm8: {
            type: String,
            required: [true, 'is required'],
        },
        ayd1: {
            type: Number,
            required: [true, 'is required'],
        },
        ayd2: {
            type: Number,
            required: [true, 'is required'],
        },
        ayd3: {
            type: Number,
            required: [true, 'is required'],
        },
        ayd4: {
            type: Number,
            required: [true, 'is required'],
        },
        averageCC: {
            type: Number,
            required: [true, 'is required'],
        },
        averageCE: {
            type: Number,
            required: [true, 'is required'],
        },
        totalM: {
            type: Number,
            required: [true, 'is required'],
        },
        averageAyd: {
            type: Number,
            required: [true, 'is required'],
        },
        type: {
            type: String,
            required: [true, 'is required'],
        },
        status: {
            type: String,
            enum: ['Pendiente', 'Concluido'],
            default: 'Pendiente'
        }
    }
)

const retests = mongoose.model('retests', retestsSchema);

module.exports = retests;