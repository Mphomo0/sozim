'use client'
import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type Props = {
  form: UseFormReturn<FormValues>
}

export default function DemographicsSection({ form }: Props) {
  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        Demographics Details
      </h2>
      <p className="text-gray-600 text-sm">
        * Compulsory Information required by the Department of Higher Education
        (DHET).
      </p>

      <Field>
        <FieldLabel>Socio-economic Status</FieldLabel>
        <RadioGroup
          value={form.watch('socioEconomicStatus')}
          onValueChange={(value) =>
            form.setValue('socioEconomicStatus', value as any)
          }
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { value: 'employed', label: 'Employed' },
            { value: 'unemployed-seeking', label: 'Unemployed, seeking work' },
            {
              value: 'unemployed-not-seeking',
              label: 'Unemployed, not seeking work',
            },
            { value: 'pensioner', label: 'Pensioner / Retired' },
            { value: 'student', label: 'Student / Scholar' },
            { value: 'disabled', label: 'Unable to work (Disabled)' },
          ].map((s) => (
            <label
              key={s.value}
              className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100"
            >
              <RadioGroupItem value={s.value} id={s.value} />
              <p className="font-medium">{s.label}</p>
            </label>
          ))}
        </RadioGroup>
        <FieldError>
          {form.formState.errors.socioEconomicStatus?.message}
        </FieldError>
      </Field>

      <Field>
        <FieldLabel>Home Language</FieldLabel>
        <RadioGroup
          value={form.watch('homeLanguage')}
          onValueChange={(value) => form.setValue('homeLanguage', value as any)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {[
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
          ].map((lang) => (
            <label
              key={lang}
              className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100"
            >
              <RadioGroupItem value={lang} id={lang} />
              <p className="font-medium">
                {lang === 'other'
                  ? 'Other'
                  : lang.charAt(0).toUpperCase() +
                    lang
                      .slice(1)
                      .replace('isi', 'isi')
                      .replace('se', 'Se')
                      .replace('xi', 'Xi')
                      .replace('tshi', 'Tshi')}
              </p>
            </label>
          ))}
        </RadioGroup>

        {form.watch('homeLanguage') === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Specify your home language"
              {...form.register('homeLanguageOther')}
            />
            <FieldError>
              {form.formState.errors.homeLanguageOther?.message}
            </FieldError>
          </div>
        )}
      </Field>

      <Field>
        <FieldLabel>Gender</FieldLabel>
        <RadioGroup
          value={form.watch('gender')}
          onValueChange={(value) =>
            form.setValue('gender', value as 'male' | 'female' | 'not-disclose')
          }
          className="flex flex-col gap-3"
        >
          {[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'not-disclose', label: 'Do not wish to disclose' },
          ].map((g) => (
            <label
              key={g.value}
              className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100"
            >
              <RadioGroupItem value={g.value} id={g.value} />
              <p className="font-medium">{g.label}</p>
            </label>
          ))}
        </RadioGroup>
        <FieldError>{form.formState.errors.gender?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Race</FieldLabel>
        <RadioGroup
          value={form.watch('race')}
          onValueChange={(value) => form.setValue('race', value as any)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {[
            { value: 'african', label: 'African' },
            { value: 'coloured', label: 'Coloured' },
            { value: 'indian-asian', label: 'Indian / Asian' },
            { value: 'white', label: 'White' },
            { value: 'other', label: 'Other' },
          ].map((r) => (
            <label
              key={r.value}
              className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100"
            >
              <RadioGroupItem value={r.value} id={r.value} />
              <p className="font-medium">{r.label}</p>
            </label>
          ))}
        </RadioGroup>

        {form.watch('race') === 'other' && (
          <Field className="mt-3">
            <FieldLabel htmlFor="raceOther">Specify Race</FieldLabel>
            <Input
              id="raceOther"
              placeholder="Specify your race"
              {...form.register('raceOther')}
            />
            <FieldError>{form.formState.errors.raceOther?.message}</FieldError>
          </Field>
        )}
      </Field>
    </div>
  )
}
