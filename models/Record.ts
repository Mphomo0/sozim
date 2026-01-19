import mongoose, { Schema, model, models } from 'mongoose'
import type { Record as RecordType, MetaData } from '@/lib/types'

const RecordSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    authors: [String],
    description: String,
    keywords: [String],
    year: Number,
    source: { type: String, index: true },
    type: { type: String, index: true },
    identifier: String,
    identifierType: String,
    url: String,
    category: {
      type: String,
      enum: ['thesis', 'article', 'research'],
      index: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

// Text index for smart search across title and description
RecordSchema.index({ title: 'text', description: 'text', keywords: 'text' })
RecordSchema.index({ source: 1, year: 1 })
RecordSchema.index({ category: 1, type: 1 })

const MetaSchema = new Schema<MetaData>(
  {
    key: { type: String, required: true, unique: true },
    lastUpdated: { type: Date, default: Date.now },
    counts: {
      theses: { type: Number, default: 0 },
      articles: { type: Number, default: 0 },
      research: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    lastHarvest: Date,
    lastError: {
      context: String,
      message: String,
      time: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Record = mongoose.models.Record || mongoose.model('Record', RecordSchema)
const Meta = mongoose.models.Meta || mongoose.model('Meta', MetaSchema)

export { Record, Meta }
