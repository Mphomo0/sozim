'use client'
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form'
import { FormValues, provinces } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'

type Props = {
  form: UseFormReturn<FormValues>
  fields: UseFieldArrayReturn<FormValues, 'qualifications', 'id'>['fields']
  append: UseFieldArrayReturn<FormValues, 'qualifications', 'id'>['append']
  remove: UseFieldArrayReturn<FormValues, 'qualifications', 'id'>['remove']
}

export default function ProgrammeDetails({
  form,
  fields,
  append,
  remove,
}: Props) {
  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        Programme Details
      </h2>
      <p className="text-gray-600">
        * You must be successfully enrolled in the programme to proceed with
        Registration
      </p>

      <Field>
        <FieldLabel>Highest Grade Achieved</FieldLabel>
        <RadioGroup
          value={form.watch('highestGradeAchieved')}
          onValueChange={(value) =>
            form.setValue('highestGradeAchieved', value as any)
          }
          className="space-y-4"
        >
          <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100">
            <RadioGroupItem
              value="grade-12-in-progress"
              id="grade-12-in-progress"
            />
            <span>Grade 12 in progress</span>
          </label>
          <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100">
            <RadioGroupItem
              value="grade-12-completed"
              id="grade-12-completed"
            />
            <span>Grade 12 Completed</span>
          </label>
          <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100">
            <RadioGroupItem value="other" id="other" />
            <span>Other</span>
          </label>
        </RadioGroup>

        {form.watch('highestGradeAchieved') === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Please specify"
              {...form.register('highestGradeOther')}
            />
            <FieldError>
              {form.formState.errors.highestGradeOther?.message}
            </FieldError>
          </div>
        )}
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="yearCompleted">Year Completed</FieldLabel>
          <Input
            id="yearCompleted"
            placeholder="Year Completed e.g 2018"
            {...form.register('yearCompleted')}
          />
          <FieldError>
            {form.formState.errors.yearCompleted?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="schoolAttended">School Attended</FieldLabel>
          <Input
            id="schoolAttended"
            placeholder="e.g Brebner High School"
            {...form.register('schoolAttended')}
          />
          <FieldError>
            {form.formState.errors.schoolAttended?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="schoolProvince">School Province</FieldLabel>
          <select
            id="schoolProvince"
            {...form.register('schoolProvince')}
            className="w-full border border-input rounded px-3 py-2 focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          <FieldError>
            {form.formState.errors.schoolProvince?.message}
          </FieldError>
        </Field>
      </div>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg bg-white shadow-sm space-y-4"
        >
          <Field>
            <FieldLabel>Tertiary Qualification Achieved</FieldLabel>
            <RadioGroup
              value={form.watch(
                `qualifications.${index}.tertiaryQualification`
              )}
              onValueChange={(value) =>
                form.setValue(
                  `qualifications.${index}.tertiaryQualification`,
                  value as any
                )
              }
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {[
                { label: 'Certificate', value: 'certificate' },
                { label: 'Diploma', value: 'diploma' },
                { label: 'Degree', value: 'degree' },
                { label: 'Postgraduate', value: 'postgraduate' },
                { label: 'Masters', value: 'masters' },
                { label: 'Other', value: 'other' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100"
                >
                  <RadioGroupItem value={option.value} />
                  <span>{option.label}</span>
                </label>
              ))}
            </RadioGroup>

            {form.watch(`qualifications.${index}.tertiaryQualification`) ===
              'other' && (
              <div className="mt-3">
                <Input
                  placeholder="Please specify"
                  {...form.register(
                    `qualifications.${index}.tertiaryQualificationOther`
                  )}
                />
                <FieldError>
                  {
                    form.formState.errors.qualifications?.[index]
                      ?.tertiaryQualificationOther?.message
                  }
                </FieldError>
              </div>
            )}
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel
                htmlFor={`qualifications.${index}.tertiaryQualificationName`}
              >
                Tertiary Qualification Name
              </FieldLabel>
              <Input
                id={`qualifications.${index}.tertiaryQualificationName`}
                placeholder="Tertiary Qualification Name"
                {...form.register(
                  `qualifications.${index}.tertiaryQualificationName`
                )}
              />
              <FieldError>
                {
                  form.formState.errors.qualifications?.[index]
                    ?.tertiaryQualificationName?.message
                }
              </FieldError>
            </Field>

            <Field>
              <FieldLabel
                htmlFor={`qualifications.${index}.tertiaryInstitution`}
              >
                Tertiary Institution Attended
              </FieldLabel>
              <Input
                id={`qualifications.${index}.tertiaryInstitution`}
                placeholder="Tertiary Institution"
                {...form.register(
                  `qualifications.${index}.tertiaryInstitution`
                )}
              />
              <FieldError>
                {
                  form.formState.errors.qualifications?.[index]
                    ?.tertiaryInstitution?.message
                }
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={`qualifications.${index}.yearCommenced`}>
                Year Commenced
              </FieldLabel>
              <Input
                id={`qualifications.${index}.yearCommenced`}
                placeholder="Year Commenced"
                {...form.register(`qualifications.${index}.yearCommenced`)}
              />
              <FieldError>
                {
                  form.formState.errors.qualifications?.[index]?.yearCommenced
                    ?.message
                }
              </FieldError>
            </Field>

            <Field>
              <FieldLabel
                htmlFor={`qualifications.${index}.YearCompletedTertiary`}
              >
                Year Completed
              </FieldLabel>
              <Input
                id={`qualifications.${index}.YearCompletedTertiary`}
                placeholder="Year Completed"
                {...form.register(
                  `qualifications.${index}.YearCompletedTertiary`
                )}
              />
              <FieldError>
                {
                  form.formState.errors.qualifications?.[index]
                    ?.YearCompletedTertiary?.message
                }
              </FieldError>
            </Field>
          </div>

          <button
            type="button"
            className="mt-2 text-red-500 hover:underline"
            onClick={() => remove(index)}
          >
            Remove Qualification
          </button>
        </div>
      ))}

      <button
        type="button"
        className="mt-4 bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/80"
        onClick={() =>
          append({
            tertiaryQualification: 'certificate',
            tertiaryQualificationOther: '',
            tertiaryQualificationName: '',
            tertiaryInstitution: '',
            yearCommenced: '',
            YearCompletedTertiary: '',
          })
        }
      >
        Add Qualification
      </button>
    </div>
  )
}
