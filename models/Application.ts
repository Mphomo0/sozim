import mongoose, { Schema } from 'mongoose'

const applicationSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
    documents: [
      {
        fileId: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.models.Application ||
  mongoose.model('Application', applicationSchema)
