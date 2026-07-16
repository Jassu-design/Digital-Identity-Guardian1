import mongoose from 'mongoose'

const mobileNumberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      trim: true,
      maxlength: [50, 'Label cannot exceed 50 characters'],
    },
    countryCode: {
      type: String,
      trim: true,
      default: '+1',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true,
      match: [/^\d{4,15}$/, 'Please enter a valid phone number'],
    },
    ownershipStatus: {
      type: String,
      trim: true,
      default: 'unknown',
    },
    suspectedRecycled: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
)

const MobileNumber = mongoose.model('MobileNumber', mobileNumberSchema)

export default MobileNumber
