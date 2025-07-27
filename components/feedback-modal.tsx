"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Send, MessageSquare } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function FeedbackModal({ isOpen, onClose, userEmail }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate feedback submission
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFeedback("")
        setCategory("")
      }, 2000)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Share Your Feedback
            </CardTitle>
            <CardDescription>Help us improve Pomodoc for medical students</CardDescription>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🙏</div>
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Thank you!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your feedback helps us make PomoDOC better for all medical students.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's this about?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">🐛 Bug Report</SelectItem>
                    <SelectItem value="feature">💡 Feature Request</SelectItem>
                    <SelectItem value="improvement">⚡ Improvement</SelectItem>
                    <SelectItem value="general">💬 General Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think, what's working well, or what could be improved..."
                  className="min-h-[100px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || !feedback.trim()}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
