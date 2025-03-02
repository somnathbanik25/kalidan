"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { Donation } from "@/lib/types"

interface DonationModalProps {
  onClose: () => void
  onSave: (donation: Donation) => void
  donation: Donation | null
  existingSerialNumbers: string[]
}

export default function DonationModal({ onClose, onSave, donation, existingSerialNumbers }: DonationModalProps) {
  const [formData, setFormData] = useState<Donation>({
    serialNumber: "",
    name: "",
    nickName: "",
    amount2025: 0,
    amount2024: 0,
    amount2023: 0,
    amount2022: 0,
  })
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (donation) {
      setFormData(donation)
    } else {
      // Generate a suggested serial number (but user can change it)
      const existingNumbers = existingSerialNumbers.map((sn) => {
        const matches = sn.match(/([A-Za-z]*)(\d+)/)
        return matches ? Number.parseInt(matches[2]) : 0
      })
      const maxNumber = Math.max(0, ...existingNumbers)
      setFormData((prev) => ({
        ...prev,
        serialNumber: `A${(maxNumber + 1).toString().padStart(3, "0")}`,
      }))
    }
  }, [donation, existingSerialNumbers])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Donation) => {
    const { value } = e.target

    if (field === "amount2025" || field === "amount2024" || field === "amount2023" || field === "amount2022") {
      setFormData({
        ...formData,
        [field]: value ? Number.parseInt(value) : 0,
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.serialNumber) {
      newErrors.serialNumber = "Serial number is required"
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.serialNumber)) {
      newErrors.serialNumber = "Serial number can only contain letters, numbers, hyphens and underscores"
    } else if (
      existingSerialNumbers.includes(formData.serialNumber) &&
      (!donation || donation.serialNumber !== formData.serialNumber)
    ) {
      newErrors.serialNumber = "This serial number already exists"
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password !== "dhamrai123") {
      newErrors.password = "Incorrect password"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-primary">{donation ? "Edit Donation" : "Add New Donation"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="serialNumber" className="required">
              Serial Number
            </Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange(e, "serialNumber")}
              className={errors.serialNumber ? "border-red-500" : ""}
              placeholder="e.g., A001 or B-123"
            />
            {errors.serialNumber && <p className="mt-1 text-sm text-red-500">{errors.serialNumber}</p>}
          </div>

          <div>
            <Label htmlFor="name" className="required">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="nickName">Nick Name</Label>
            <Input id="nickName" value={formData.nickName} onChange={(e) => handleChange(e, "nickName")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount2025">Amount 2025 (₹)</Label>
              <Input
                id="amount2025"
                type="number"
                value={formData.amount2025 || ""}
                onChange={(e) => handleChange(e, "amount2025")}
              />
            </div>

            <div>
              <Label htmlFor="amount2024">Amount 2024 (₹)</Label>
              <Input
                id="amount2024"
                type="number"
                value={formData.amount2024 || ""}
                onChange={(e) => handleChange(e, "amount2024")}
              />
            </div>

            <div>
              <Label htmlFor="amount2023">Amount 2023 (₹)</Label>
              <Input
                id="amount2023"
                type="number"
                value={formData.amount2023 || ""}
                onChange={(e) => handleChange(e, "amount2023")}
              />
            </div>

            <div>
              <Label htmlFor="amount2022">Amount 2022 (₹)</Label>
              <Input
                id="amount2022"
                type="number"
                value={formData.amount2022 || ""}
                onChange={(e) => handleChange(e, "amount2022")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="required">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {donation ? "Update Donation" : "Add Donation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

