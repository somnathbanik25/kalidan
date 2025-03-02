"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Donation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, TrendingUp, IndianRupee } from "lucide-react"

export default function Dashboard() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeDonors: 0,
    totalDonations2025: 0,
  })
  const [yearlyTrends, setYearlyTrends] = useState<{ name: string; amount: number }[]>([])

  useEffect(() => {
    // Load donations from localStorage
    const savedDonations = localStorage.getItem("donations")
    if (savedDonations) {
      try {
        const parsedDonations = JSON.parse(savedDonations)
        setDonations(parsedDonations)

        // Calculate stats
        const uniqueDonors = new Set(parsedDonations.map((d: Donation) => d.serialNumber))
        const activeDonors = parsedDonations.filter((d: Donation) => d.amount2024 > 0 || d.amount2025 > 0)
        const totalDonations2025 = parsedDonations.reduce((sum: number, d: Donation) => sum + (d.amount2025 || 0), 0)

        setStats({
          totalDonors: uniqueDonors.size,
          activeDonors: new Set(activeDonors.map((d: Donation) => d.serialNumber)).size,
          totalDonations2025,
        })

        // Calculate yearly trends
        const years = ["2022", "2023", "2024", "2025"]
        const trends = years.map((year) => {
          const total = parsedDonations.reduce(
            (sum: number, d: Donation) => sum + ((d[`amount${year}` as keyof Donation] as number) || 0),
            0,
          )
          return {
            name: year,
            amount: total,
          }
        })

        setYearlyTrends(trends)
      } catch (error) {
        console.error("Failed to parse donations:", error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold text-primary md:text-3xl">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDonors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Donors (2024-2025)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeDonors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations (2025)</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.totalDonations2025)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Yearly Donation Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyTrends}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="amount" fill="#d4a017" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

