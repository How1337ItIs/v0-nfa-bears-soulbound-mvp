"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  xp: number
}

export default function GetStartedTab() {
  const [selectedPath, setSelectedPath] = useState<"genesis" | "miracle" | null>(null)
  const [donationAmount, setDonationAmount] = useState(10)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "twitter",
      title: "Share on Twitter",
      description: "Share NFA Bears with your network",
      completed: false,
      xp: 100,
    },
    { id: "discord", title: "Join Discord", description: "Connect with the community", completed: true, xp: 50 },
    { id: "welcome", title: "Welcome 3 Members", description: "Help grow the family", completed: false, xp: 200 },
    {
      id: "event",
      title: "Attend Virtual Event",
      description: "Join a community gathering",
      completed: false,
      xp: 150,
    },
    { id: "art", title: "Submit Art/Music", description: "Share your creative work", completed: false, xp: 300 },
  ])

  const completedTasks = tasks.filter((t) => t.completed).length
  const totalXP = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.xp, 0)
  const requiredTasks = 3 // Need 3/5 tasks for Miracle SBT

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <div className="space-y-8">
      {/* Path Selection */}
      <div className="text-center mb-8">
        <h2 className="groovy-font text-4xl mb-4 glow-text">Choose Your Path 🛤️</h2>
        <p className="text-white/80 text-lg">Two ways to join the cosmic family</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Genesis Bear Path */}
        <Card
          className={`glassmorphic-card cosmic-border transition-all duration-300 hover:scale-105 cursor-pointer ${
            selectedPath === "genesis" ? "ring-2 ring-red-400" : ""
          }`}
          onClick={() => setSelectedPath("genesis")}
        >
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🐻‍❄️</div>
            <CardTitle className="groovy-font text-2xl text-red-400">Own a Genesis Bear</CardTitle>
            <Badge className="bg-red-500/20 text-red-300 border-red-400">Instant Access</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">20% Discounts</div>
              <div className="text-white/80">+ DAO Voting Rights</div>
              <div className="text-white/80">+ Exclusive Events</div>
              <div className="text-white/80">+ Ambassador Status</div>
            </div>

            {selectedPath === "genesis" && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/30">
                  <p className="text-white/90 text-sm">
                    Genesis Bears are available on secondary markets. Owning one grants you full family privileges
                    instantly.
                  </p>
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Find Genesis Bears 🔍</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Miracle SBT Path */}
        <Card
          className={`glassmorphic-card cosmic-border transition-all duration-300 hover:scale-105 cursor-pointer ${
            selectedPath === "miracle" ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() => setSelectedPath("miracle")}
        >
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <CardTitle className="groovy-font text-2xl text-blue-400">Get Miracle SBT</CardTitle>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400">Earn Your Way</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">10% Discounts</div>
              <div className="text-white/80">+ Community Access</div>
              <div className="text-white/80">+ Event Invites</div>
              <div className="text-white/80">+ POAT Collection</div>
            </div>

            {selectedPath === "miracle" && (
              <div className="space-y-4 animate-fade-in">
                {/* Donation Path */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/30">
                  <h4 className="font-bold text-white mb-2">💝 Donation Path</h4>
                  <div className="flex gap-2 mb-3">
                    {[10, 25, 50].map((amount) => (
                      <Button
                        key={amount}
                        size="sm"
                        variant={donationAmount === amount ? "default" : "outline"}
                        onClick={() => setDonationAmount(amount)}
                        className={donationAmount === amount ? "bg-blue-500" : ""}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Donate ${donationAmount} → Instant Miracle SBT
                  </Button>
                </div>

                {/* Task Path */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/30">
                  <h4 className="font-bold text-white mb-2">🎯 Community Tasks Path</h4>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-white/80 mb-1">
                      <span>
                        Progress: {completedTasks}/{requiredTasks} tasks
                      </span>
                      <span>{totalXP} XP</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((completedTasks / requiredTasks) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="rounded"
                          />
                          <div>
                            <div className="text-white text-sm">{task.title}</div>
                            <div className="text-white/60 text-xs">{task.description}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.xp} XP
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {completedTasks >= requiredTasks ? (
                    <Button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white">
                      Claim Your Miracle SBT! ✨
                    </Button>
                  ) : (
                    <div className="text-center mt-3 text-white/60 text-sm">
                      Complete {requiredTasks - completedTasks} more tasks to unlock
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cosmic Decision Interface */}
      {!selectedPath && (
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🌟</div>
          <p className="text-white/80 text-lg">Click a path above to begin your cosmic journey</p>
          <div className="flex justify-center gap-4">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200" />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-400" />
          </div>
        </div>
      )}
    </div>
  )
}
