"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Assuming you have an API key set up as an environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Disney World coordinates (approximate)
const DISNEY_WORLD_LAT = 28.3852
const DISNEY_WORLD_LNG = -81.5639

// Popular Disney movies and their lengths in minutes
const disneyMovies = [
  { title: "The Lion King", length: 88 },
  { title: "Frozen", length: 102 },
  { title: "Toy Story", length: 81 },
  { title: "Aladdin", length: 90 },
  { title: "Moana", length: 107 },
]

export default function DisneyDistanceCalculator() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const calculateDistance = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    try {
      // Geocode the address
      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`)
      const geocodeData = await geocodeResponse.json()

      if (geocodeData.status !== 'OK') {
        throw new Error('Failed to geocode address')
      }

      const { lat, lng } = geocodeData.results[0].geometry.location

      // Calculate distance
      const distanceResponse = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${DISNEY_WORLD_LAT},${DISNEY_WORLD_LNG}&key=${GOOGLE_MAPS_API_KEY}`)
      const distanceData = await distanceResponse.json()

      if (distanceData.status !== 'OK') {
        throw new Error('Failed to calculate distance')
      }

      const distanceInMeters = distanceData.rows[0].elements[0].distance.value
      const distanceInKm = distanceInMeters / 1000

      // Convert distance to Disney movie lengths
      const movieLengths = disneyMovies.map(movie => {
        const count = Math.round(distanceInKm / (movie.length * 0.133)) // Assuming average walking speed of 5 km/h or 0.133 km/min
        return `${count} times the length of "${movie.title}"`
      })

      setResult(`You are approximately ${distanceInKm.toFixed(2)} km away from Walt Disney World. That's about:\n${movieLengths.join('\n')}`)
    } catch (error) {
      setResult('An error occurred while calculating the distance. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Disney World Distance Calculator</CardTitle>
        <CardDescription>Find out how far you are from the magic!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={calculateDistance} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Distance'}
          </Button>
        </form>
      </CardContent>
      {result && (
        <CardFooter>
          <p className="whitespace-pre-line">{result}</p>
        </CardFooter>
      )}
    </Card>
  )
}
