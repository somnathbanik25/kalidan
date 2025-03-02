import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit } from "lucide-react"
import type { Donation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface DonationTableProps {
  donations: Donation[]
  onEdit: (donation: Donation) => void
  selectedDonations: Set<string>
  onToggleSelect: (serialNumber: string) => void
}

export default function DonationTable({ donations, onEdit, selectedDonations, onToggleSelect }: DonationTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              {donations.length > 0 && (
                <Checkbox
                  checked={donations.length > 0 && donations.every((d) => selectedDonations.has(d.serialNumber))}
                  onCheckedChange={(checked) => {
                    donations.forEach((d) =>
                      checked ? selectedDonations.add(d.serialNumber) : selectedDonations.delete(d.serialNumber),
                    )
                  }}
                />
              )}
            </TableHead>
            <TableHead className="w-[100px]">Serial No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Nick Name</TableHead>
            <TableHead className="text-right">2025</TableHead>
            <TableHead className="text-right">2024</TableHead>
            <TableHead className="text-right">2023</TableHead>
            <TableHead className="text-right">2022</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No donations found
              </TableCell>
            </TableRow>
          ) : (
            donations.map((donation) => (
              <TableRow key={donation.serialNumber}>
                <TableCell>
                  <Checkbox
                    checked={selectedDonations.has(donation.serialNumber)}
                    onCheckedChange={() => onToggleSelect(donation.serialNumber)}
                  />
                </TableCell>
                <TableCell>{donation.serialNumber}</TableCell>
                <TableCell>{donation.name}</TableCell>
                <TableCell>{donation.nickName}</TableCell>
                <TableCell className="text-right">
                  {donation.amount2025 ? formatCurrency(donation.amount2025) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {donation.amount2024 ? formatCurrency(donation.amount2024) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {donation.amount2023 ? formatCurrency(donation.amount2023) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {donation.amount2022 ? formatCurrency(donation.amount2022) : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(donation)}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

