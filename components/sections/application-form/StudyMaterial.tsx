'use client'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'

type Props = {
  form: UseFormReturn<FormValues>
}

export default function StudyMaterial({ form }: Props) {
  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        Study Material
      </h2>
      <p className="text-gray-600 text-sm">
        * Indicate your preferred method of Delivery
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="deliveryAddress">Delivery Address</FieldLabel>
          <Textarea
            id="deliveryAddress"
            placeholder="Delivery Address"
            {...form.register('deliveryAddress')}
          />
          <FieldError>
            {form.formState.errors.deliveryAddress?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="provinceDelivery">Province</FieldLabel>
          <Select
            onValueChange={(value) => form.setValue('provinceDelivery', value)}
            defaultValue={form.getValues('provinceDelivery')}
          >
            <SelectTrigger id="provinceDelivery">
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
              <SelectItem value="free-state">Free State</SelectItem>
              <SelectItem value="gauteng">Gauteng</SelectItem>
              <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
              <SelectItem value="limpopo">Limpopo</SelectItem>
              <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
              <SelectItem value="northern-cape">Northern Cape</SelectItem>
              <SelectItem value="north-west">North West</SelectItem>
              <SelectItem value="western-cape">Western Cape</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>
            {form.formState.errors.provinceDelivery?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="postalCodeDelivery">Postal Code</FieldLabel>
          <Input
            id="postalCodeDelivery"
            placeholder="Postal Code"
            {...form.register('postalCodeDelivery')}
          />
          <FieldError>
            {form.formState.errors.postalCodeDelivery?.message}
          </FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel>Delivery Method</FieldLabel>
        <RadioGroup
          value={form.watch('deliveryMethod')}
          onValueChange={(value) =>
            form.setValue(
              'deliveryMethod',
              value as 'postnet' | 'paxi' | 'electronically' | 'campus-collect'
            )
          }
          className="space-y-4"
        >
          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="postnet" id="postnet" />
            <div>
              <p className="font-semibold">POSTNET</p>
              <p className="text-sm text-gray-600">
                Collect at a Postnet nearest to you…
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="paxi" id="paxi" />
            <div>
              <p className="font-semibold">
                PAXI - PROVIDE PAXI COLLECTION POINT
              </p>
              <p className="text-sm text-gray-600">
                Collect at a PEP Store nearest to you…
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="electronically" id="electronic" />
            <div>
              <p className="font-semibold">ELECTRONICALLY</p>
              <p className="text-sm text-gray-600">
                Study guides will be available on CANVAS…
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="campus-collect" id="campus-collect" />
            <div>
              <p className="font-semibold">CAMPUS COLLECT</p>
              <p className="text-sm text-gray-600">Sozim Campus</p>
            </div>
          </label>
        </RadioGroup>
        <FieldError>{form.formState.errors.deliveryMethod?.message}</FieldError>
      </Field>
    </div>
  )
}
