import mongoose from 'mongoose'

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    mobileNumberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileNumber',
      default: null,
    },

    title: {
      type: String,
      required: [true, 'Incident title is required'],
      trim: true,
      minlength: [3, 'Title must contain at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [3, 'Message must contain at least 3 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },

    sender: {
      type: String,
      trim: true,
      maxlength: [100, 'Sender cannot exceed 100 characters'],
      default: 'Unknown',
    },

    category: {
      type: String,
      enum: [
        'otp',
        'banking',
        'phishing',
        'delivery',
        'government',
        'healthcare',
        'social_media',
        'promotional',
        'recycled_number',
        'identity_theft',
        'other',
      ],
      default: 'other',
      index: true,
    },

    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
      index: true,
    },

    riskScore: {
      type: Number,
      min: [0, 'Risk score cannot be below 0'],
      max: [100, 'Risk score cannot exceed 100'],
      default: 0,
    },

    analysis: {
      isSuspicious: {
        type: Boolean,
        default: false,
      },

      hasOtp: {
        type: Boolean,
        default: false,
      },

      hasExternalLink: {
        type: Boolean,
        default: false,
      },

      detectedUrls: {
        type: [String],
        default: [],
      },

      detectedKeywords: {
        type: [String],
        default: [],
      },

      explanation: {
        type: String,
        trim: true,
        maxlength: [2000, 'Explanation cannot exceed 2000 characters'],
        default: '',
      },

      recommendations: {
        type: [String],
        default: [],
      },

      recycledNumberRelevance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      analyzedBy: {
        type: String,
        enum: ['rule_based', 'gemini', 'manual'],
        default: 'rule_based',
      },
    },

    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'false_positive'],
      default: 'open',
      index: true,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolutionNote: {
      type: String,
      trim: true,
      maxlength: [1000, 'Resolution note cannot exceed 1000 characters'],
      default: '',
    },

    source: {
      type: String,
      enum: ['manual', 'sms', 'screenshot', 'email', 'other'],
      default: 'manual',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

incidentSchema.index({
  userId: 1,
  createdAt: -1,
})

incidentSchema.index({
  userId: 1,
  status: 1,
})

incidentSchema.index({
  userId: 1,
  severity: 1,
})

incidentSchema.pre('save', function updateResolutionFields(next) {
  if (
    this.status === 'resolved' ||
    this.status === 'false_positive'
  ) {
    if (!this.resolvedAt) {
      this.resolvedAt = new Date()
    }
  } else {
    this.resolvedAt = null
  }

  next()
})

const Incident = mongoose.model('Incident', incidentSchema)

export default Incident