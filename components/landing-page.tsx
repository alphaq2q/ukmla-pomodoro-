"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, TrendingUp, Users, Mail, CheckCircle } from "lucide-react"

interface LandingPageProps {
  onLogin: (user: { name: string; email: string }) => void
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleGoogleLogin = () => {
    // Simulate Google login
    onLogin({
      name: "Medical Student",
      email: "student@medical.edu",
    })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate successful signup without Mailchimp
    setTimeout(() => {
      onLogin({
        name: "Medical Student",
        email: email,
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="space-y-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">🍅 Pomodoc </Badge>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Master the UKMLA with
              <span className="text-blue-600"> Focused Study Sessions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {"Track your progress across all 24 UKMLA subspecialties with the evidence-based Pomodoro Technique. Stay focused, study smarter, and ace your MLA."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGoogleLogin}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            <Button onClick={() => setShowEmailForm(true)} variant="outline" size="lg" className="px-8 py-3 text-lg">
              Sign up with Email
            </Button>
          </div>

          {showEmailForm && (
            <Card className="max-w-md mx-auto mt-6">
              <CardHeader>
                <CardTitle>Join the UKMLA Study Community</CardTitle>
                <CardDescription>Get started with your personalized study tracker</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Start Studying"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>25-minute focused study sessions with automatic 5-minute breaks</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>24 UKMLA Subspecialties</CardTitle>
              <CardDescription>Track progress across all major areas from Cardiology to Surgery</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>Detailed statistics and insights into your study patterns</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-6 h-6 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-800">Coming Soon</Badge>
            </div>
            <CardTitle className="text-2xl text-purple-900">Leaderboards & Competition</CardTitle>
            <CardDescription className="text-purple-700">
              Compete with fellow medical students, join study challenges, and climb the rankings
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                <CheckCircle className="w-4 h-4" />
                <span>Weekly study challenges</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                <CheckCircle className="w-4 h-4" />
                <span>Anonymous leaderboards by subspecialty</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                <CheckCircle className="w-4 h-4" />
                <span>Study streak tracking</span>
              </div>
            </div>
            <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-800 mb-2">Early access pricing</p>
              <p className="text-2xl font-bold text-purple-900">£2.99/month</p>
              <p className="text-xs text-purple-600">Cancel anytime</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Notify Me When Available</Button>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-gray-600">Trusted by medical students across the UK</p>
          <div className="flex justify-center items-center gap-8 text-gray-400">
            <span className="text-sm">🏥 King's College London</span>
            <span className="text-sm">🏥 Imperial College</span>
            <span className="text-sm">🏥 Oxford University</span>
            <span className="text-sm">🏥 Cambridge University</span>
          </div>
        </div>
      </div>
    </div>
  )
}
