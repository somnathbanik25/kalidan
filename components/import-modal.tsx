"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, AlertCircle } from "lucide-react"
import type { Donation } from "@/lib/types"
import * as XLSX from "xlsx"

interface ImportModalProps {
  onClose: () => void
  onImport: (donations: Donation[]) => void
  existingSerialNumbers: string[]
}

export default function ImportModal({ onClose, onImport, existingSerialNumbers }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [parsedData, setParsedData] = useState<Donation[]>([])
  const [step, setStep] = useState<"upload" | "preview">("upload")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const validatePassword = () => {
    if (password !== "dhamrai123") {
      setError("Incorrect password")
      return false
    }
    return true
  }

  const parseExcel = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    if (!validatePassword()) {
      return
    }

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Map Excel data to our Donation structure
      const donations: Donation[] = jsonData.map((row: any, index) => {
        // Try to find the appropriate column names
        const serialNumber =
          row["Serial Number"] || row["Serial No"] || row["Serial"] || row["ID"] || (index + 1).toString()
        const name = row["Name"] || row["Full Name"] || ""
        const nickName = row["Nick Name"] || row["Nickname"] || row["Nick"] || ""
        const amount2025 = Number.parseInt(row["2025"] || row["Amount 2025"] || "0")
        const amount2024 = Number.parseInt(row["2024"] || row["Amount 2024"] || "0")
        const amount2023 = Number.parseInt(row["2023"] || row["Amount 2023"] || "0")
        const amount2022 = Number.parseInt(row["2022"] || row["Amount 2022"] || "0")

        return {
          serialNumber: serialNumber.toString(),
          name: name.toString(),
          nickName: nickName.toString(),
          amount2025: isNaN(amount2025) ? 0 : amount2025,
          amount2024: isNaN(amount2024) ? 0 : amount2024,
          amount2023: isNaN(amount2023) ? 0 : amount2023,
          amount2022: isNaN(amount2022) ? 0 : amount2022,
        }
      })

      // Validate the data
      const validDonations = donations.filter((d) => d.name)

      if (validDonations.length === 0) {
        setError("No valid donation records found in the Excel file")
        return
      }

      // Check for duplicate serial numbers
      const duplicates = validDonations.filter((d) => existingSerialNumbers.includes(d.serialNumber))

      if (duplicates.length > 0) {
        // Assign new serial numbers to duplicates
        let maxSerial = Math.max(...existingSerialNumbers.map((s) => Number.parseInt(s) || 0))

        const updatedDonations = validDonations.map((d) => {
          if (existingSerialNumbers.includes(d.serialNumber)) {
            maxSerial++
            return { ...d, serialNumber: maxSerial.toString() }
          }
          return d
        })

        setParsedData(updatedDonations)
      } else {
        setParsedData(validDonations)
      }

      setStep("preview")
    } catch (err) {
      console.error("Error parsing Excel file:", err)
      setError("Failed to parse Excel file. Please check the file format.")
    }
  }

  const handleImport = () => {
    onImport(parsedData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg md:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-primary">Import Donations from Excel</h2>

        {step === "upload" ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="excelFile" className="required">
                Excel File
              </Label>
              <Input id="excelFile" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="mt-1" />
              <p className="mt-1 text-sm text-gray-500">Upload an Excel file with donation records</p>
            </div>

            <div>
              <Label htmlFor="importPassword" className="required">
                Password
              </Label>
              <Input
                id="importPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error.includes("password") ? "border-red-500" : ""}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="ml-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="border-gray-300">
                Cancel
              </Button>
              <Button type="button" onClick={parseExcel} className="bg-primary hover:bg-primary/90" disabled={!file}>
                <Upload className="mr-2 h-4 w-4" />
                Parse Excel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Preview: {parsedData.length} records found</h3>
              <p className="text-sm text-gray-500">Please review the data before importing</p>
            </div>

            <div className="max-h-60 overflow-y-auto rounded border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial No.
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nick Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.slice(0, 5).map((donation, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{donation.serialNumber}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{donation.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{donation.nickName}</td>
                    </tr>
                  ))}
                  {parsedData.length > 5 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-sm text-gray-500 text-center">
                        ...and {parsedData.length - 5} more records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setStep("upload")} className="border-gray-300">
                Back
              </Button>
              <Button type="button" onClick={handleImport} className="bg-primary hover:bg-primary/90">
                Import {parsedData.length} Records
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

