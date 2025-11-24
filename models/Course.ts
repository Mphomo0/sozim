import mongoose, { Schema } from 'mongoose'
import './CourseCategory'

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    duration: { type: String, required: true },
    isOpen: { type: Boolean, required: true, default: true },

    // relation to category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseCategory',
      required: true,
    },

    // reverse relation
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    ],
  },
  { timestamps: true }
)

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema)

export default Course // Export the actual model instance
