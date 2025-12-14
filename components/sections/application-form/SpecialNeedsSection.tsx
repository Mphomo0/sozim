'use client'
import { UseFormReturn } from 'react-hook-form'
import { FormValues, DisabilityKey } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type Props = {
  form: UseFormReturn<FormValues>
  watchSpecialNeeds: FormValues['specialNeeds']
  disabilityPath: (key: DisabilityKey) => `disabilities.${DisabilityKey}`
}

export default function SpecialNeedsSection({
  form,
  watchSpecialNeeds,
  disabilityPath,
}: Props) {
  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        Special Needs Status
      </h2>
      <p className="text-gray-600 text-sm">
        * If you have any disabilities or special needs, please complete the
        information below
      </p>

      <Field>
        <FieldLabel>Disability or Special Needs Requirement</FieldLabel>
        <RadioGroup
          value={watchSpecialNeeds ?? undefined}
          onValueChange={(value) =>
            form.setValue('specialNeeds', value as 'yes' | 'none')
          }
          className="flex flex-col gap-4"
        >
          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="yes" id="yes" />
            <p className="font-medium">
              Yes, I have a disability or special needs requirement
            </p>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="none" id="none" />
            <p className="font-medium">None</p>
          </label>
        </RadioGroup>

        <FieldError>{form.formState.errors.specialNeeds?.message}</FieldError>

        {watchSpecialNeeds === 'yes' && (
          <div className="mt-6 space-y-6 border rounded-xl p-6 bg-white shadow-sm">
            <p className="font-medium">Rate your disability or special need:</p>
            <p className="text-sm text-gray-600">
              1. No difficulty · 2. Some difficulty · 3. A lot of difficulty ·
              4. Cannot do at all · 5. Cannot yet be determined · 6. Former
              difficulty, none now
            </p>

            <div className="space-y-6">
              {[
                { key: 'seeing', label: 'Seeing' },
                { key: 'hearing', label: 'Hearing' },
                { key: 'communication', label: 'Communication (Speech)' },
                { key: 'physical', label: 'Physical' },
                { key: 'emotional', label: 'Emotional' },
                { key: 'intellectual', label: 'Intellectual (Learning)' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <Label className="w-48 font-semibold">{item.label}</Label>
                  <div className="flex gap-4">
                    {['1', '2', '3', '4', '5', '6'].map((num) => (
                      <label
                        key={num}
                        className="flex flex-col items-center gap-1 text-sm"
                      >
                        <Checkbox
                          checked={
                            form.watch(
                              disabilityPath(item.key as DisabilityKey)
                            ) === num
                          }
                          onCheckedChange={() =>
                            form.setValue(
                              disabilityPath(item.key as DisabilityKey),
                              num as any
                            )
                          }
                        />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <Label>Specific requirements for examination purposes</Label>
              <Input
                placeholder="e.g., wheelchair access"
                {...form.register('examRequirements')}
              />
            </div>
          </div>
        )}
      </Field>
    </div>
  )
}
