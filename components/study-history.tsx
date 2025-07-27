"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen } from "lucide-react"

interface StudySession {
  date: string
  specialty: string
  emoji: string
  sessions: number
  totalMinutes: number
}

interface StudyHistoryProps {
  userEmail: string
  currentStats: { [key: string]: number }
}

export function StudyHistory({ userEmail, currentStats }: StudyHistoryProps) {
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem(`ukmla-study-history-${userEmail}`)
    if (savedHistory) {
      setStudyHistory(JSON.parse(savedHistory))
    }
  }, [userEmail])

  // Update history when stats change
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const existingHistory = [...studyHistory]

    Object.entries(currentStats).forEach(([specialty, count]) => {
      if (count > 0) {
        const existingIndex = existingHistory.findIndex(
          (session) => session.date === today && session.specialty === specialty,
        )

        if (existingIndex >= 0) {
          existingHistory[existingIndex].sessions = count
          existingHistory[existingIndex].totalMinutes = count * 25
        } else {
          // Find emoji for specialty
          const specialtyData = UKMLA_SUBSPECIALTIES.find((s) => s.name === specialty)
          existingHistory.push({
            date: today,
            specialty,
            emoji: specialtyData?.emoji || "📚",
            sessions: count,
            totalMinutes: count * 25,
          })
        }
      }
    })

    setStudyHistory(existingHistory)
    localStorage.setItem(`ukmla-study-history-${userEmail}`, JSON.stringify(existingHistory))
  }, [currentStats, userEmail])

  const getRecentSessions = () => {
    return studyHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const recentSessions = getRecentSessions()

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Study History
        </CardTitle>
        <CardDescription>Your recent study sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div
                key={`${session.date}-${session.specialty}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">{session.emoji}</div>
                  <div>
                    <div className="font-medium text-sm">{session.specialty}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(session.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {session.sessions} 🍅
                  </Badge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {session.totalMinutes}m
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No study sessions yet. Start your first Pomodoro to see your history here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Updated UKMLA specialties
const UKMLA_SUBSPECIALTIES = [
  { name: "Cardiovascular", emoji: "❤️" },
  { name: "Cancer", emoji: "🎗️" },
  { name: "Respiratory", emoji: "🫁" },
  { name: "Breast", emoji: "🩺" },
  { name: "Gastrointestinal", emoji: "🍽️" },
  { name: "Haematology", emoji: "🩸" },
  { name: "Medicine of older adult", emoji: "👴" },
  { name: "Palliative and End of Life care", emoji: "🕊️" },
  { name: "Neurosciences", emoji: "🧠" },
  { name: "Peri-operative medicine & anaesthesia", emoji: "⚕️" },
  { name: "Ophthalmology", emoji: "👁️" },
  { name: "Musculoskeletal", emoji: "🦴" },
  { name: "Endocrine & metabolic", emoji: "⚖️" },
  { name: "Emergency medicine & intensive care", emoji: "🚨" },
  { name: "Renal & Urology", emoji: "🫘" },
  { name: "Ear, nose & throat", emoji: "👂" },
  { name: "Infection", emoji: "🦠" },
  { name: "Child health", emoji: "👶" },
  { name: "Dermatology", emoji: "🧴" },
  { name: "Mental health", emoji: "🧘" },
  { name: "Obstetrics & gynaecology", emoji: "🤱" },
  { name: "Sexual health", emoji: "💕" },
  { name: "Social/population health & research methods", emoji: "📊" },
  { name: "Medical ethics & law", emoji: "⚖️" },
]
