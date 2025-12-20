import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  firstName?: string
  lastName?: string
  phone?: string // Changed to optional
  alternativeNumber?: string
  dob?: Date
  email?: string
  address?: string
  password?: string // Changed to optional for Magic Link users
  idNumber?: string
  nationality?: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  applications: mongoose.Types.ObjectId[]
  comparePassword(candidatePassword: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/missing phones without unique conflict
      trim: true,
    },
    alternativeNumber: { type: String, trim: true, sparse: true },
    dob: { type: Date },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    address: { type: String, trim: true },
    password: {
      type: String,
      // No required: true here so Magic Link users can exist
    },
    idNumber: { type: String, trim: true },
    nationality: { type: String, trim: true },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'MODERATOR'],
      default: 'USER',
    },
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    ],
  },
  { timestamps: true }
)

// Modified Hash middleware
userSchema.pre('save', async function (next) {
  // Only hash if there is a password AND it's modified
  if (!this.password || !this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // Guard against null passwords (magic link users trying to use credentials)
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

function getUserModel(): Model<IUser> {
  return mongoose.models.User || mongoose.model<IUser>('User', userSchema)
}

export default getUserModel()
