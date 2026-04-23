import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional if guest can raise ticket
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    type: {
        type: String,
        enum: ['registered', 'guest'],
        default: 'guest'
    },
    conversation: [{
        sender: {
            type: String,
            enum: ['user', 'admin'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['open', 'pending', 'resolved', 'closed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface ITicket extends mongoose.Document {
    ticketId: string;
    user?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    subject: string;
    type: 'registered' | 'guest';
    conversation: Array<{
        sender: 'user' | 'admin';
        message: string;
        createdAt: Date;
    }>;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    createdAt: Date;
}

const Ticket: mongoose.Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', ticketSchema);
export default Ticket;
