"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, FileText } from "lucide-react"

interface SessionNotesProps {
  userEmail: string
  currentSubspecialty: string
}

export function SessionNotes({ userEmail, currentSubspecialty }: SessionNotesProps) {
  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState<{ [key: string]: string }>({})

  // Load saved notes on mount
  useEffect(() => {
    const saved = localStorage.getItem(`ukmla-notes-${userEmail}`)
    if (saved) {
      const parsedNotes = JSON.parse(saved)
      setSavedNotes(parsedNotes)
      setNotes(parsedNotes[currentSubspecialty] || "")
    }
  }, [userEmail, currentSubspecialty])

  const saveNotes = () => {
    const updatedNotes = {
      ...savedNotes,
      [currentSubspecialty]: notes,
    }
    setSavedNotes(updatedNotes)
    localStorage.setItem(`ukmla-notes-${userEmail}`, JSON.stringify(updatedNotes))
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-green-800">
          <FileText className="w-4 h-4" />
          Quick Notes - {currentSubspecialty}
        </CardTitle>
        <CardDescription className="text-xs text-green-700">
          Jot down key points from your study session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you learn? Key concepts to review..."
          className="min-h-[80px] text-sm bg-white/80 border-green-200 focus:border-green-400"
        />
        <Button onClick={saveNotes} size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
          <Save className="w-3 h-3 mr-1" />
          Save Notes
        </Button>
      </CardContent>
    </Card>
  )
}
