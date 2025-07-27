"use client"

import { useState } from "react"
import { LandingPage } from "../components/landing-page"
import { PomodoroTimer } from "../pomodoro-timer"

interface User {
  name: string
  email: string
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />
  }

  return <PomodoroTimer user={user} onLogout={handleLogout} />
}
