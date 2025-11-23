import mongoose, { Schema } from 'mongoose'

const courseCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1 },
    code: { type: String, required: true, trim: true, minlength: 1 },
    description: { type: String, trim: true },

    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
)

export default mongoose.models.CourseCategory ||
  mongoose.model('CourseCategory', courseCategorySchema)
