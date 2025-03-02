"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmModalProps {
  onClose: () => void
  onConfirm: (password: string) => void
  count: number
}

export default function DeleteConfirmModal({ onClose, onConfirm, count }: DeleteConfirmModalProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      setError("Password is required")
      return
    }

    if (password !== "dhamrai123") {
      setError("Incorrect password")
      return
    }

    onConfirm(password)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3 text-destructive">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-bold">Confirm Deletion</h2>
        </div>

        <p className="mb-4 text-gray-600">
          Are you sure you want to delete {count} selected donation{count !== 1 ? "s" : ""}? This action cannot be
          undone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="deletePassword" className="required">
              Enter Password to Confirm
            </Label>
            <Input
              id="deletePassword"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Delete {count} Item{count !== 1 ? "s" : ""}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

