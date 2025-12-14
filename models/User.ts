import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
// import './Application'

// TypeScript interface
export interface IUser extends Document {
  firstName?: string
  lastName?: string
  phone: string
  alternativeNumber?: string
  dob?: Date
  email?: string
  address?: string
  password: string
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
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    alternativeNumber: {
      type: String,
      trim: true,
    },
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
      minlength: [6, 'Password must be at least 6 characters'],
    },
    idNumber: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
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

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Use a getter function instead of immediate evaluation
function getUserModel(): Model<IUser> {
  if (mongoose.models && mongoose.models.User) {
    return mongoose.models.User as Model<IUser>
  }
  return mongoose.model<IUser>('User', userSchema)
}

export default getUserModel()
