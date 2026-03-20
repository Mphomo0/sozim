import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    mongoId: v.optional(v.string()), // Retained for migration matching
    clerkId: v.optional(v.string()), // The eventual source of truth for auth
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    alternativeNumber: v.optional(v.string()),
    dob: v.optional(v.union(v.string(), v.number())), // dates imported as ISO strings or raw ms numbers
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    nationality: v.optional(v.string()),
    role: v.string(), // 'USER' | 'ADMIN' | 'MODERATOR'
    applications: v.optional(v.array(v.string())), // Legacy Mongo IDs until migrated

    createdAt: v.optional(v.union(v.string(), v.number())),
    updatedAt: v.optional(v.union(v.string(), v.number())),
    __v: v.optional(v.number()),
  }).index("by_email", ["email"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_mongo_id", ["mongoId"]),

  courseCategories: defineTable({
    mongoId: v.optional(v.string()),
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    courses: v.optional(v.array(v.string())), // Legacy Mongo IDs
    
    createdAt: v.optional(v.union(v.string(), v.number())),
    updatedAt: v.optional(v.union(v.string(), v.number())),
    __v: v.optional(v.number()),
  }).index("by_mongo_id", ["mongoId"]),

  courses: defineTable({
    mongoId: v.optional(v.string()),
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    duration: v.string(),
    isOpen: v.boolean(),
    
    // Mongoose links
    categoryId: v.string(), // Will be pure string initially 
    actualCategoryId: v.optional(v.id("courseCategories")), // Real convex link later

    applications: v.optional(v.array(v.string())),

    modules: v.optional(v.object({
      knowledgeModules: v.optional(v.array(v.object({
        _id: v.optional(v.string()),
        title: v.optional(v.string()),
        nqfLevel: v.optional(v.number()),
        credits: v.optional(v.number())
      }))),
      practicalSkillModules: v.optional(v.array(v.object({
        _id: v.optional(v.string()),
        title: v.optional(v.string()),
        nqfLevel: v.optional(v.number()),
        credits: v.optional(v.number())
      }))),
      workExperienceModules: v.optional(v.array(v.object({
        _id: v.optional(v.string()),
        title: v.optional(v.string()),
        nqfLevel: v.optional(v.number()),
        credits: v.optional(v.number())
      })))
    })),

    creditTotals: v.optional(v.object({
      knowledge: v.optional(v.number()),
      practical: v.optional(v.number()),
      workExperience: v.optional(v.number()),
      total: v.optional(v.number())
    })),

    entryRequirements: v.optional(v.array(v.string())),
    qualification: v.optional(v.string()),
    level: v.optional(v.string()),

    createdAt: v.optional(v.union(v.string(), v.number())),
    updatedAt: v.optional(v.union(v.string(), v.number())),
    __v: v.optional(v.number()),
  }).index("by_mongo_id", ["mongoId"])
    .index("by_actual_category", ["actualCategoryId"]),

  applications: defineTable({
    mongoId: v.optional(v.string()),
    
    applicantId: v.string(), // mongo id string initially
    actualApplicantId: v.optional(v.id("users")), // Real convex link
    clerkId: v.optional(v.string()), // Clerk ID for direct user lookup

    courseId: v.string(), // mongo id string initially 
    actualCourseId: v.optional(v.id("courses")),

    status: v.string(), // 'PENDING' | 'APPROVED' | 'REJECTED'
    
    documents: v.optional(v.array(v.object({
      _id: v.optional(v.string()),
      fileId: v.optional(v.string()),
      url: v.optional(v.string())
    }))),

    // Form fields mapped exactly
    fullNameCompany: v.optional(v.string()),
    sponsor: v.optional(v.string()),
    companyReg: v.optional(v.string()),
    sponsorEmail: v.optional(v.string()),
    homeAddress: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    alternativeNumber: v.optional(v.string()),
    selectYourRace: v.optional(v.string()),
    genderDebtor: v.optional(v.string()),
    nationality: v.optional(v.string()),
    employmentStatus: v.optional(v.string()),
    employerName: v.optional(v.string()),
    employmentSector: v.optional(v.string()),
    employerAddress: v.optional(v.string()),
    maritalStatus: v.optional(v.string()),
    deliveryAddress: v.optional(v.string()),
    provinceDelivery: v.optional(v.string()),
    postalCodeDelivery: v.optional(v.string()),
    deliveryMethod: v.optional(v.string()), // enum
    highestGradeAchieved: v.optional(v.string()), // enum
    highestGradeOther: v.optional(v.string()),
    yearCompleted: v.optional(v.string()),
    schoolAttended: v.optional(v.string()),
    schoolProvince: v.optional(v.string()),
    
    qualifications: v.optional(v.array(v.object({
      _id: v.optional(v.string()),
      tertiaryQualification: v.optional(v.string()),
      tertiaryQualificationOther: v.optional(v.string()),
      tertiaryQualificationName: v.optional(v.string()),
      tertiaryInstitution: v.optional(v.string()),
      yearCommenced: v.optional(v.string()),
      YearCompletedTertiary: v.optional(v.string())
    }))),

    qualificationType: v.optional(v.string()),
    socioEconomicStatus: v.optional(v.string()),
    homeLanguage: v.optional(v.string()),
    homeLanguageOther: v.optional(v.string()),
    gender: v.optional(v.string()),
    race: v.optional(v.string()),
    raceOther: v.optional(v.string()),
    specialNeeds: v.optional(v.string()),
    
    disabilities: v.optional(v.object({
      seeing: v.optional(v.string()),
      hearing: v.optional(v.string()),
      communication: v.optional(v.string()),
      physical: v.optional(v.string()),
      emotional: v.optional(v.string()),
      intellectual: v.optional(v.string()),
    })),
    
    examRequirements: v.optional(v.string()),

    createdAt: v.optional(v.union(v.string(), v.number())),
    updatedAt: v.optional(v.union(v.string(), v.number())),
    __v: v.optional(v.number()),
  }).index("by_mongo_id", ["mongoId"])
    .index("by_user", ["actualApplicantId"])
    .index("by_course", ["actualCourseId"]),

  records: defineTable({
    id: v.string(), // Extracted unique ID (e.g. zenodo-123)
    title: v.string(),
    authors: v.array(v.string()),
    description: v.optional(v.string()),
    keywords: v.array(v.string()),
    year: v.optional(v.number()),
    source: v.string(),
    type: v.string(),
    identifier: v.optional(v.string()),
    identifierType: v.optional(v.string()),
    url: v.optional(v.string()),
    category: v.string(), // 'thesis' | 'article' | 'research'
    
    // Metadata fields
    importDate: v.number(), // timestamp
  }).index("by_record_id", ["id"])
    .index("by_category", ["category"])
    .index("by_source", ["source"])
    .index("by_year", ["year"])
    .searchIndex("search_title_description", {
      searchField: "title",
      filterFields: ["category", "source"]
    }),

  libraryMeta: defineTable({
    key: v.string(), // e.g. 'main'
    lastUpdated: v.number(),
    lastHarvest: v.optional(v.number()),
    counts: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
      total: v.number(),
    }),
    lastError: v.optional(v.object({
      context: v.string(),
      message: v.string(),
      time: v.number(),
    })),
  }).index("by_key", ["key"]),

  harvestJobs: defineTable({
    type: v.string(), // 'full' | 'incremental'
    status: v.string(), // 'pending' | 'running' | 'completed' | 'failed'
    progress: v.number(), // 0-100
    currentRepo: v.optional(v.string()),
    totalRepos: v.number(),
    processedRepos: v.number(),
    results: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
    }),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
});
