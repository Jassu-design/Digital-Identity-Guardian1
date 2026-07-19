import mongoose from 'mongoose'
import crypto from 'crypto'

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    role: {
      type: String,
      enum: ['admin', 'analyst', 'member'],
      default: 'member',
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
)

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'Organization name is required.',
      ],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    industry: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'Other',
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
      default: '',
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: '',
    },

    website: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    members: {
      type: [memberSchema],
      default: [],
    },

    inviteCode: {
      type: String,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
)

organizationSchema.index({
  'members.userId': 1,
})

organizationSchema.pre(
  'validate',
  function generateInviteCode(next) {
    if (!this.inviteCode) {
      this.inviteCode = crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase()
    }

    next()
  },
)

organizationSchema.pre(
  'save',
  function addOwnerAsMember(next) {
    if (!this.ownerId) {
      return next()
    }

    const ownerAlreadyAdded = this.members.some(
      member =>
        member.userId.toString() ===
        this.ownerId.toString(),
    )

    if (!ownerAlreadyAdded) {
      this.members.push({
        userId: this.ownerId,
        role: 'admin',
      })
    }

    next()
  },
)

const Organization = mongoose.model(
  'Organization',
  organizationSchema,
)

export default Organization