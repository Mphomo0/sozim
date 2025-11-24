import mongoose, { Schema, model, models } from 'mongoose'
import './Course'

const courseCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1 },
    code: { type: String, required: true, trim: true, minlength: 1 },
    description: { type: String, trim: true },

    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
)

// Use the exported variable name as the model name convention
const CourseCategory =
  mongoose.models.CourseCategory ||
  mongoose.model('CourseCategory', courseCategorySchema)

export default CourseCategory // Export the actual model instance
