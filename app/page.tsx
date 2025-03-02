"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import DonationTable from "@/components/donation-table"
import DonationModal from "@/components/donation-modal"
import ImportModal from "@/components/import-modal"
import DeleteConfirmModal from "@/components/delete-confirm-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, FileSpreadsheet, Trash2 } from "lucide-react"
import type { Donation } from "@/lib/types"

export default function Home() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [selectedDonations, setSelectedDonations] = useState<Set<string>>(new Set())

  // Load donations from localStorage on initial render
  useEffect(() => {
    const savedDonations = localStorage.getItem("donations")
    if (savedDonations) {
      try {
        const parsedDonations = JSON.parse(savedDonations)
        setDonations(parsedDonations)
        setFilteredDonations(parsedDonations)
      } catch (error) {
        console.error("Failed to parse donations:", error)
      }
    } else {
      // Sample data
      const sampleData: Donation[] = [
        {
          serialNumber: "A001",
          name: "John Doe",
          nickName: "Johnny",
          amount2025: 2000,
          amount2024: 1500,
          amount2023: 1200,
          amount2022: 1000,
        },
        {
          serialNumber: "B002",
          name: "Jane Smith",
          nickName: "Janey",
          amount2025: 1500,
          amount2024: 1200,
          amount2023: 1000,
          amount2022: 800,
        },
        {
          serialNumber: "C003",
          name: "Robert Johnson",
          nickName: "Bob",
          amount2025: 2500,
          amount2024: 2000,
          amount2023: 1800,
          amount2022: 1500,
        },
      ]
      setDonations(sampleData)
      setFilteredDonations(sampleData)
      localStorage.setItem("donations", JSON.stringify(sampleData))
    }
  }, [])

  // Filter donations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDonations(donations)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = donations.filter(
      (donation) =>
        donation.name.toLowerCase().includes(query) ||
        donation.nickName.toLowerCase().includes(query) ||
        donation.serialNumber.toLowerCase().includes(query),
    )
    setFilteredDonations(filtered)
  }, [searchQuery, donations])

  // Add or update donation
  const handleSaveDonation = (donation: Donation) => {
    let updatedDonations: Donation[]

    if (editingDonation) {
      // Update existing donation
      updatedDonations = donations.map((d) => (d.serialNumber === editingDonation.serialNumber ? donation : d))
    } else {
      // Add new donation
      updatedDonations = [...donations, donation]
    }

    setDonations(updatedDonations)
    localStorage.setItem("donations", JSON.stringify(updatedDonations))
    setShowDonationModal(false)
    setEditingDonation(null)
  }

  // Import donations from Excel
  const handleImportDonations = (importedDonations: Donation[]) => {
    const updatedDonations = [...donations, ...importedDonations]
    setDonations(updatedDonations)
    localStorage.setItem("donations", JSON.stringify(updatedDonations))
    setShowImportModal(false)
  }

  // Edit donation
  const handleEditDonation = (donation: Donation) => {
    setEditingDonation(donation)
    setShowDonationModal(true)
  }

  // Toggle donation selection
  const handleToggleSelect = (serialNumber: string) => {
    const newSelected = new Set(selectedDonations)
    if (newSelected.has(serialNumber)) {
      newSelected.delete(serialNumber)
    } else {
      newSelected.add(serialNumber)
    }
    setSelectedDonations(newSelected)
  }

  // Delete selected donations
  const handleDeleteSelected = (password: string) => {
    if (password === "dhamrai123") {
      const updatedDonations = donations.filter((donation) => !selectedDonations.has(donation.serialNumber))
      setDonations(updatedDonations)
      localStorage.setItem("donations", JSON.stringify(updatedDonations))
      setSelectedDonations(new Set())
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-primary md:text-3xl">Dhamrai Puja Committee</h1>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => setShowDonationModal(true)} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Donation
              </Button>
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
              {selectedDonations.size > 0 && (
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="destructive"
                  className="bg-destructive hover:bg-destructive/90"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedDonations.size})
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search by name, nickname or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-full border-gray-300 md:max-w-md"
            />
          </div>

          <DonationTable
            donations={filteredDonations}
            onEdit={handleEditDonation}
            selectedDonations={selectedDonations}
            onToggleSelect={handleToggleSelect}
          />
        </div>
      </main>

      {showDonationModal && (
        <DonationModal
          onClose={() => {
            setShowDonationModal(false)
            setEditingDonation(null)
          }}
          onSave={handleSaveDonation}
          donation={editingDonation}
          existingSerialNumbers={donations
            .filter((d) => !editingDonation || d.serialNumber !== editingDonation.serialNumber)
            .map((d) => d.serialNumber)}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportDonations}
          existingSerialNumbers={donations.map((d) => d.serialNumber)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteSelected}
          count={selectedDonations.size}
        />
      )}
    </div>
  )
}

