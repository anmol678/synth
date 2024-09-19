"use client"

import { useState, useEffect } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">{message}</h1>
    </div>
  )
}