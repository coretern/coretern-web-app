import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String
    },
    domain: {
        type: String,
        required: [true, 'Please specify the domain (e.g. Web Dev, AI)']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    duration: {
        type: String,
        required: [true, 'Please add duration (e.g. 4 Weeks, 3 Months)']
    },
    fee: {
        type: Number,
        required: [true, 'Please add the internship fee']
    },
    curriculum: [String],
    details: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    videos: [
        {
            title: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            duration: String
        }
    ],
    whatsappGroup: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface IInternship extends mongoose.Document {
    title: string;
    description?: string;
    domain: string;
    image: string;
    duration: string;
    fee: number;
    curriculum: string[];
    details?: string;
    active: boolean;
    videos: Array<{
        title: string;
        url: string;
        duration?: string;
    }>;
    whatsappGroup?: string;
    createdAt: Date;
}

const Internship: mongoose.Model<IInternship> = mongoose.models.Internship || mongoose.model<IInternship>('Internship', internshipSchema);
export default Internship;
