import mongoose, { Schema } from 'mongoose'
import './Course'
import './User'

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
    },
    documents: [
      {
        fileId: String,
        url: String,
      },
    ],

    // --- Form Fields ---
    fullNameCompany: { type: String },
    sponsor: { type: String },
    companyReg: { type: String },
    sponsorEmail: { type: String },
    homeAddress: { type: String },
    phoneNumber: { type: String },
    alternativeNumber: { type: String },
    selectYourRace: { type: String },
    genderDebtor: { type: String },
    nationality: { type: String },
    employmentStatus: { type: String },
    employerName: { type: String },
    employmentSector: { type: String },
    employerAddress: { type: String },
    maritalStatus: { type: String },
    deliveryAddress: { type: String },
    provinceDelivery: { type: String },
    postalCodeDelivery: { type: String },
    deliveryMethod: {
      type: String,
      enum: ['postnet', 'paxi', 'electronically', 'campus-collect'],
    },
    highestGradeAchieved: {
      type: String,
      enum: ['grade-12-in-progress', 'grade-12-completed', 'other'],
    },
    highestGradeOther: { type: String },
    yearCompleted: { type: String },
    schoolAttended: { type: String },
    schoolProvince: { type: String },
    qualifications: [
      {
        tertiaryQualification: {
          type: String,
          enum: [
            'certificate',
            'diploma',
            'degree',
            'postgraduate',
            'masters',
            'other',
          ],
        },
        tertiaryQualificationOther: { type: String },
        tertiaryQualificationName: { type: String },
        tertiaryInstitution: { type: String },
        yearCommenced: { type: String },
        YearCompletedTertiary: { type: String }, // Must match form exactly!
      },
    ],
    qualificationType: {
      type: String,
      enum: ['undergraduate', 'postgraduate'],
    },

    socioEconomicStatus: {
      type: String,
      enum: [
        'employed',
        'unemployed-seeking',
        'unemployed-not-seeking',
        'pensioner',
        'student',
        'disabled',
      ],
    },
    homeLanguage: {
      type: String,
      enum: [
        'afrikaans',
        'english',
        'isindebele',
        'isixhosa',
        'isizulu',
        'sepedi',
        'siswati',
        'xitsonga',
        'setswana',
        'tshivenda',
        'other',
      ],
    },
    homeLanguageOther: { type: String },

    gender: { type: String, enum: ['male', 'female', 'not-disclose'] },
    race: {
      type: String,
      enum: ['african', 'coloured', 'indian-asian', 'white', 'other'],
    },
    raceOther: { type: String },

    specialNeeds: { type: String, enum: ['yes', 'none'] },
    disabilities: {
      seeing: { type: String, enum: ['1', '2', '3', '4', '5', '6'] },
      hearing: { type: String, enum: ['1', '2', '3', '4', '5', '6'] },
      communication: { type: String, enum: ['1', '2', '3', '4', '5', '6'] },
      physical: { type: String, enum: ['1', '2', '3', '4', '5', '6'] },
      emotional: { type: String, enum: ['1', '2', '3', '4', '5', '6'] },
      intellectual: { type: String, enum: ['1', '2', '3', '4', '5', '6'] },
    },
    examRequirements: { type: String, maxlength: 200 },
  },
  { timestamps: true }
)

export default mongoose.models.Application ||
  mongoose.model('Application', applicationSchema)
