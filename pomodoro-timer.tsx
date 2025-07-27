"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  BookOpen,
  TrendingUp,
  LogOut,
  Users,
  Bell,
  BellOff,
  MessageSquare,
  History,
} from "lucide-react"
import { ThemeToggle } from "./components/theme-toggle"
import { SessionNotes } from "./components/session-notes"
import { OfflineIndicator } from "./components/offline-indicator"
import { FeedbackModal } from "./components/feedback-modal"
import { StudyHistory } from "./components/study-history"

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

const BREAK_ADVICE = [
  {
    title: "Deep Breathing",
    description:
      "Take 4 deep breaths: inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system.",
    icon: "🫁",
  },
  {
    title: "Avoid Your Phone",
    description: "Resist checking social media or messages. Give your brain a true break from information processing.",
    icon: "📱",
  },
  {
    title: "Gentle Stretching",
    description: "Roll your shoulders, stretch your neck, and do some gentle spinal twists to relieve study tension.",
    icon: "🧘",
  },
  {
    title: "Hydrate",
    description: "Drink a glass of water. Proper hydration is crucial for cognitive function and memory consolidation.",
    icon: "💧",
  },
  {
    title: "Eye Rest",
    description: "Look away from screens. Focus on something 20 feet away for 20 seconds to rest your eyes.",
    icon: "👁️",
  },
  {
    title: "Quick Walk",
    description: "Take a brief walk around your study space. Movement increases blood flow to the brain.",
    icon: "🚶",
  },
  {
    title: "Mindful Moment",
    description: "Close your eyes and focus on the present moment. Notice your breathing and let go of study stress.",
    icon: "🧠",
  },
  {
    title: "Posture Check",
    description: "Adjust your sitting position, align your spine, and relax your shoulders for better focus.",
    icon: "🪑",
  },
]

const WORK_TIME = 25 * 60 // 25 minutes in seconds
const BREAK_TIME = 5 * 60 // 5 minutes in seconds

interface PomodoroStats {
  [key: string]: number
}

interface User {
  name: string
  email: string
}

interface PomodoroTimerProps {
  user: User
  onLogout: () => void
}

export function PomodoroTimer({ user, onLogout }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [selectedSubspecialty, setSelectedSubspecialty] = useState("")
  const [pomodoroStats, setPomodoroStats] = useState<PomodoroStats>({})
  const [currentSession, setCurrentSession] = useState(0)
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0)
  const [showLeaderboardInterest, setShowLeaderboardInterest] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showBreakChoice, setShowBreakChoice] = useState(false)
  const [longBreakTime, setLongBreakTime] = useState(15 * 60)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load settings and stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem(`ukmla-pomodoro-stats-${user.email}`)
    if (savedStats) {
      setPomodoroStats(JSON.parse(savedStats))
    }

    const savedTheme = localStorage.getItem(`ukmla-theme-${user.email}`)
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificationsEnabled(permission === "granted")
      })
    } else if (Notification.permission === "granted") {
      setNotificationsEnabled(true)
    }

    // Track page view
  }, [user.email])

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`ukmla-pomodoro-stats-${user.email}`, JSON.stringify(pomodoroStats))
  }, [pomodoroStats, user.email])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.code) {
        case "Space":
          event.preventDefault()
          toggleTimer()
          break
        case "KeyR":
          event.preventDefault()
          resetTimer()
          break
        case "KeyF":
          event.preventDefault()
          setShowFeedback(true)
          break
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9":
          if (!isBreak) {
            const index = Number.parseInt(event.code.slice(-1)) - 1
            if (index < UKMLA_SUBSPECIALTIES.length) {
              setSelectedSubspecialty(UKMLA_SUBSPECIALTIES[index].name)
            }
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isActive, isBreak, selectedSubspecialty])

  // Timer logic with auto-start breaks and 4-pomodoro cycle
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Play notification sound and show browser notification
      playNotificationSound()
      showBrowserNotification()

      // Timer finished
      if (!isBreak && selectedSubspecialty) {
        // Work session completed - increment stats
        setPomodoroStats((prev) => ({
          ...prev,
          [selectedSubspecialty]: (prev[selectedSubspecialty] || 0) + 1,
        }))
        setCurrentSession((prev) => prev + 1)
        setCompletedPomodoros((prev) => prev + 1)

        // Track pomodoro completion
      }

      // Check if it's time for a long break (every 4 pomodoros)
      if (!isBreak && completedPomodoros > 0 && (completedPomodoros + 1) % 4 === 0) {
        setShowBreakChoice(true)
        setIsActive(false)
        return
      }

      // Switch between work and break and auto-start break
      const newIsBreak = !isBreak
      setIsBreak(newIsBreak)
      setTimeLeft(newIsBreak ? BREAK_TIME : WORK_TIME)

      // Auto-start break, but not work session
      setIsActive(newIsBreak)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, isBreak, selectedSubspecialty, completedPomodoros, notificationsEnabled, currentSession])

  // Rotate advice every 30 seconds during breaks
  useEffect(() => {
    if (isBreak && isActive) {
      const adviceInterval = setInterval(() => {
        setCurrentAdviceIndex((prev) => (prev + 1) % BREAK_ADVICE.length)
      }, 30000)

      return () => clearInterval(adviceInterval)
    }
  }, [isBreak, isActive])

  const toggleTimer = () => {
    if (!isBreak && !selectedSubspecialty) {
      alert("Please select a subspecialty before starting your study session!")
      return
    }
    setIsActive(!isActive)

    // Track timer actions
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTimeLeft(WORK_TIME)

    // Track reset
  }

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem(`ukmla-theme-${user.email}`, newDarkMode ? "dark" : "light")

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Track theme toggle
  }

  const toggleNotifications = () => {
    if (!notificationsEnabled && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationsEnabled(permission === "granted")
      })
    } else {
      setNotificationsEnabled(!notificationsEnabled)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTotalPomodoros = () => {
    return Object.values(pomodoroStats).reduce((sum, count) => sum + count, 0)
  }

  const getTopSubspecialties = () => {
    return Object.entries(pomodoroStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const getSubspecialtyEmoji = (name: string) => {
    return UKMLA_SUBSPECIALTIES.find((spec) => spec.name === name)?.emoji || "📚"
  }

  const progress = (((isBreak ? BREAK_TIME : WORK_TIME) - timeLeft) / (isBreak ? BREAK_TIME : WORK_TIME)) * 100

  const handleBreakChoice = (isLongBreak: boolean) => {
    setShowBreakChoice(false)
    setIsBreak(true)
    setTimeLeft(isLongBreak ? longBreakTime : BREAK_TIME)
    setIsActive(true)

    if ((completedPomodoros + 1) % 4 === 0) {
      setCompletedPomodoros(0) // Reset cycle after long break choice
    }

    // Track break choice
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  const showBrowserNotification = () => {
    if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
      const title = isBreak ? "Break Complete!" : "Study Session Complete!"
      const body = isBreak
        ? "Time to get back to studying. You've got this!"
        : `Great work on ${selectedSubspecialty}! Time for a well-deserved break.`

      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      })
    }
  }

  const themeClasses = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white"
    : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"

  return (
    <div className={themeClasses}>
      <OfflineIndicator />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2">
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>PomoDOC</h1>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Welcome back, {user.name}!</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowFeedback(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <MessageSquare className="w-4 h-4" />
              Feedback
            </Button>
            <Button
              onClick={toggleNotifications}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              {notificationsEnabled ? "On" : "Off"}
            </Button>
            <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className={`text-center text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          💡 Shortcuts: <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd> to
          start/pause,
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs ml-1">R</kbd> to reset,
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs ml-1">F</kbd> for feedback,
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs ml-1">1-9</kbd> to select specialty
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <Card
              className={`w-full max-w-md mx-auto transition-all duration-500 ${
                isBreak
                  ? "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 shadow-lg dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 dark:border-green-700"
                  : isDarkMode
                    ? "bg-slate-800/50 border-slate-700 backdrop-blur-sm"
                    : "bg-white"
              }`}
            >
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {isBreak ? (
                    <>
                      <Clock className="w-5 h-5 text-green-600" />
                      Break Time - Recharge Your Mind
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Study Session
                    </>
                  )}
                </CardTitle>
                {!isBreak && selectedSubspecialty && (
                  <CardDescription>
                    Studying:{" "}
                    <Badge variant="secondary" className="gap-1">
                      {getSubspecialtyEmoji(selectedSubspecialty)} {selectedSubspecialty}
                    </Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-mono font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={progress} className="w-full h-2" />
                </div>

                {!isBreak && (
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4].map((num) => (
                      <div
                        key={num}
                        className={`w-3 h-3 rounded-full ${
                          num <= (completedPomodoros % 4) + (isActive ? 1 : 0)
                            ? "bg-blue-500"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {isBreak && (
                  <div className="space-y-4">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:bg-slate-800/70 dark:border-green-700">
                      <div className="text-center space-y-3">
                        <div className="text-3xl">{BREAK_ADVICE[currentAdviceIndex].icon}</div>
                        <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg">
                          {BREAK_ADVICE[currentAdviceIndex].title}
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                          {BREAK_ADVICE[currentAdviceIndex].description}
                        </p>
                        <div className="flex justify-center space-x-1 mt-3">
                          {BREAK_ADVICE.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentAdviceIndex ? "bg-green-500" : "bg-green-200 dark:bg-green-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedSubspecialty && (
                      <SessionNotes userEmail={user.email} currentSubspecialty={selectedSubspecialty} />
                    )}
                  </div>
                )}

                {!isBreak && (
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Select Subspecialty:
                    </label>
                    <Select value={selectedSubspecialty} onValueChange={setSelectedSubspecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a subspecialty to study" />
                      </SelectTrigger>
                      <SelectContent>
                        {UKMLA_SUBSPECIALTIES.map((subspecialty, index) => (
                          <SelectItem key={subspecialty.name} value={subspecialty.name}>
                            <span className="flex items-center gap-2">
                              <kbd className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">{index + 1}</kbd>
                              {subspecialty.emoji} {subspecialty.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2 justify-center">
                  <Button onClick={toggleTimer} size="lg" className="flex items-center gap-2">
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isActive ? "Pause" : "Start"}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                {currentSession > 0 && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      🍅 Sessions completed today: <span className="font-bold">{currentSession}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard Coming Soon */}
            <Card className="max-w-md mx-auto bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Coming Soon
                  </Badge>
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Leaderboards</h3>
                <p className="text-xs text-purple-700 dark:text-purple-400 mb-3">
                  Compete with fellow medical students
                </p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">£2.99/month</p>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    setShowLeaderboardInterest(true)
                    // Track interest
                  }}
                >
                  I'm Interested
                </Button>
                {showLeaderboardInterest && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Thanks! We'll notify you when it's ready
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className={isDarkMode ? "bg-slate-800/50 border-slate-700 backdrop-blur-sm" : ""}>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                  <CardDescription>Your total study sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-blue-600">{getTotalPomodoros()}</div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Total Pomodoros Completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDarkMode ? "bg-slate-800/50 border-slate-700 backdrop-blur-sm" : ""}>
                <CardHeader>
                  <CardTitle>Top Subspecialties</CardTitle>
                  <CardDescription>Your most studied areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopSubspecialties().length > 0 ? (
                      getTopSubspecialties().map(([subspecialty, count], index) => (
                        <div key={subspecialty} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                              {index + 1}
                            </Badge>
                            <span className="text-sm font-medium flex items-center gap-1">
                              {getSubspecialtyEmoji(subspecialty)} {subspecialty}
                            </span>
                          </div>
                          <Badge>{count} 🍅</Badge>
                        </div>
                      ))
                    ) : (
                      <p className={`text-sm text-center py-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No study sessions yet. Start your first Pomodoro!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className={isDarkMode ? "bg-slate-800/50 border-slate-700 backdrop-blur-sm" : ""}>
              <CardHeader>
                <CardTitle>All Subspecialties</CardTitle>
                <CardDescription>Complete breakdown of your study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {UKMLA_SUBSPECIALTIES.map((subspecialty) => (
                    <div
                      key={subspecialty.name}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDarkMode ? "bg-slate-700/50" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-sm font-medium flex items-center gap-2">
                        {subspecialty.emoji} {subspecialty.name}
                      </span>
                      <Badge variant="secondary">{pomodoroStats[subspecialty.name] || 0} 🍅</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <StudyHistory userEmail={user.email} currentStats={pomodoroStats} />
          </TabsContent>
        </Tabs>

        {/* Break Choice Modal */}
        {showBreakChoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-900/90 dark:to-indigo-900/90 dark:border-purple-700">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-purple-900 dark:text-purple-300">🎉 Great Work!</CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-400">
                  You've completed 4 Pomodoros! Choose your break length:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleBreakChoice(false)}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-1 border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20"
                  >
                    <Clock className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold">5 Minutes</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Quick break</span>
                  </Button>
                  <Button
                    onClick={() => handleBreakChoice(true)}
                    className="h-20 flex flex-col items-center justify-center space-y-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Clock className="w-6 h-6" />
                    <span className="font-semibold">15 Minutes</span>
                    <span className="text-xs">Long break</span>
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Cycle progress: {completedPomodoros + 1}/4 completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Modal */}
        <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} userEmail={user.email} />
      </div>
    </div>
  )
}
