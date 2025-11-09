<script setup>
import { ref, computed } from 'vue'

// Game state
const activeTab = ref('squad')
const simulationSpeed = ref(500)

// Team data
const teamName = ref('Melbourne Demons')
const budget = ref(50000000)
const reputation = ref(50)

// Squad with realistic player stats
const squad = ref([
  // Full Forwards
  { id: 1, name: 'Jack Mitchell', position: 'FF', overall: 89, age: 26, value: 65000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 2, name: 'Tom Brown', position: 'FF', overall: 83, age: 29, value: 32000000, goals: 0, behinds: 0, matches: 0, injured: false },

  // Half Forwards
  { id: 3, name: 'Luke Petracca', position: 'CHF', overall: 87, age: 27, value: 55000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 4, name: 'Charlie Cameron', position: 'HFF', overall: 85, age: 28, value: 48000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 5, name: 'Toby Greene', position: 'HFF', overall: 84, age: 30, value: 42000000, goals: 0, behinds: 0, matches: 0, injured: false },

  // Midfield / Ruck
  { id: 6, name: 'Max Gawn', position: 'RK', overall: 88, age: 31, value: 50000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 7, name: 'Patrick Cripps', position: 'C', overall: 90, age: 28, value: 70000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 8, name: 'Clayton Oliver', position: 'RV', overall: 88, age: 26, value: 60000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 9, name: 'Marcus Bontempelli', position: 'RR', overall: 89, age: 28, value: 65000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 10, name: 'Lachie Neale', position: 'W', overall: 87, age: 30, value: 58000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 11, name: 'Andrew McGrath', position: 'W', overall: 84, age: 26, value: 45000000, goals: 0, behinds: 0, matches: 0, injured: false },

  // Defenders
  { id: 12, name: 'Steven May', position: 'FB', overall: 86, age: 31, value: 40000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 13, name: 'Jake Lever', position: 'CHB', overall: 85, age: 28, value: 38000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 14, name: 'Nick Daicos', position: 'HBF', overall: 88, age: 21, value: 55000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 15, name: 'Bailey Smith', position: 'HBF', overall: 83, age: 23, value: 42000000, goals: 0, behinds: 0, matches: 0, injured: false },
  { id: 16, name: 'Sam Taylor', position: 'FB', overall: 82, age: 25, value: 35000000, goals: 0, behinds: 0, matches: 0, injured: false }
])

// Match state
const currentMatch = ref({
  active: false,
  opponent: '',
  homeTeam: teamName.value,
  awayTeam: '',
  homeGoals: 0,
  homeBehinds: 0,
  awayGoals: 0,
  awayBehinds: 0,
  quarter: 1,
  minute: 0,
  events: [],
  isHome: true
})

// League standings
const standings = ref([
  { team: teamName.value, played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'Richmond Tigers', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'Collingwood Magpies', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'Carlton Blues', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'Geelong Cats', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'Sydney Swans', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'Brisbane Lions', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 },
  { team: 'West Coast Eagles', played: 0, won: 0, drawn: 0, lost: 0, pointsFor: 0, pointsAgainst: 0, percentage: 100, premiership: 0 }
])

// Staff management
const staff = ref([
  { id: 1, name: 'David Johnson', role: 'Assistant Coach', rating: 85, salary: 250000, morale: 80 },
  { id: 2, name: 'Sarah Williams', role: 'Fitness Coach', rating: 82, salary: 180000, morale: 85 },
  { id: 3, name: 'Michael Chen', role: 'Sports Scientist', rating: 88, salary: 200000, morale: 75 },
  { id: 4, name: 'Emma Roberts', role: 'Physio', rating: 90, salary: 220000, morale: 90 }
])

// Financial tracking
const finances = ref({
  weeklyIncome: 500000,
  weeklyExpenses: 0,
  weeklyWages: 0,
  matchDayRevenue: 0,
  totalIncome: 0,
  totalExpenses: 0,
  week: 1
})

// Media/Inbox system
const inbox = ref([
  {
    id: 1,
    date: 'Week 1',
    from: 'AFL Media',
    subject: 'Welcome to AFL Management',
    message: 'Welcome to your new role as manager of Melbourne Demons! The board expects great things from you this season.',
    read: false,
    type: 'news'
  }
])

const nextInboxId = ref(2)

// Calendar and Fixture System
const calendar = ref({
  currentDay: 1,
  currentRound: 1,
  totalRounds: 14, // Each team plays each other twice (home and away)
  daysPerRound: 7,
  season: 2025
})

const fixtures = ref([])
const fixturesGenerated = ref(false)

// Training system
const training = ref({
  intensity: 'medium', // low, medium, high
  focus: 'balanced', // balanced, attack, defense, fitness
  lastTrainingDay: 0
})

// Chat system
const chatPerson = ref(null) // Currently selected person to chat with
const chatHistory = ref({}) // { personId: [{ from: 'user'|'person', message: '', timestamp: '' }] }
const chatInput = ref('')

// Chat response templates
const chatResponses = {
  greeting: [
    "G'day coach! How can I help you?",
    "Hey boss, what's on your mind?",
    "Good to see you coach!",
    "Always happy to chat, coach."
  ],
  performance: [
    "I'm feeling good about my form lately!",
    "I think I can do better. I'm working hard in training.",
    "Thanks coach, I'll keep giving my all for the team.",
    "The boys and I are really clicking at the moment."
  ],
  morale: [
    "I'm loving it here, coach!",
    "Morale in the group is really high right now.",
    "We're all behind you, coach.",
    "The team spirit is fantastic!"
  ],
  transfer: [
    "I'm committed to this club, coach.",
    "This is where I want to be.",
    "Not interested in leaving, this is my team.",
    "I'm here for the long haul, coach."
  ],
  injury: [
    "I'm working with the physio to get back ASAP.",
    "Frustrating to be out, but I'll be back stronger.",
    "The recovery is going well, coach.",
    "Can't wait to get back out there!"
  ],
  tactics: [
    "I'm ready to play wherever you need me, coach.",
    "I think we're set up well tactically.",
    "The game plan is clear to all of us.",
    "Love the way we're playing at the moment."
  ],
  staff: [
    "The team is working really well together.",
    "I'm here to help the club succeed in any way I can.",
    "Communication with the players is excellent.",
    "Happy to be part of this coaching setup."
  ]
}

// News story templates for enhanced inbox
const newsTemplates = [
  { type: 'league', templates: [
    'The AFL season is heating up as teams battle for finals positions.',
    'Brownlow Medal race intensifies with several players in contention.',
    'Record crowds expected for this weekend\'s blockbuster matches.',
    'AFL Commission announces new rule changes for next season.',
    'Rising star nominations announced - several young guns impress.'
  ]},
  { type: 'rivalry', templates: [
    'Local derby coming up - fans excited for the clash!',
    'Historic rivalry renewed as two powerhouses prepare to meet.',
    'Trash talk heating up between rival coaches ahead of match.'
  ]},
  { type: 'sponsor', templates: [
    'Major sponsor interested in partnering with the club.',
    'Sponsorship revenue up 15% this quarter.',
    'New merchandise deal could boost club finances.'
  ]},
  { type: 'fan', templates: [
    'Fans celebrate team\'s recent form with street parade.',
    'Social media buzzing after latest victory.',
    'Fan engagement at all-time high this season.',
    'Supporters group raises funds for club facilities.'
  ]},
  { type: 'board', templates: [
    'Board pleased with direction of the club.',
    'Club president praises coaching staff and players.',
    'Long-term strategic plan unveiled by board.',
    'Board discusses facility upgrades for training ground.'
  ]},
  { type: 'rumor', templates: [
    'Transfer speculation: rival club eyeing one of our stars.',
    'Rumors of player discontent dismissed by management.',
    'Media reports link club with high-profile recruit.',
    'Opposition clubs reportedly interested in our young talent.'
  ]}
]

// Computed properties
const sortedStandings = computed(() => {
  return [...standings.value].sort((a, b) => {
    if (b.premiership !== a.premiership) return b.premiership - a.premiership
    if (b.percentage !== a.percentage) return b.percentage - a.percentage
    return b.pointsFor - a.pointsFor
  })
})

const teamOverall = computed(() => {
  const total = squad.value.reduce((sum, player) => sum + player.overall, 0)
  return Math.round(total / squad.value.length)
})

const topScorers = computed(() => {
  return [...squad.value]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5)
})

const availableOpponents = computed(() => {
  return standings.value
    .filter(team => team.team !== teamName.value)
    .map(team => team.team)
})

const unreadMessages = computed(() => {
  return inbox.value.filter(msg => !msg.read).length
})

const totalWeeklyWages = computed(() => {
  const playerWages = squad.value.reduce((sum, player) => sum + (player.value * 0.001), 0) // 0.1% of value as weekly wage
  const staffWages = staff.value.reduce((sum, member) => sum + (member.salary / 52), 0) // Annual salary / 52 weeks
  return Math.round(playerWages + staffWages)
})

const weeklyBalance = computed(() => {
  return finances.value.weeklyIncome - totalWeeklyWages.value
})

// Match simulation functions
const startMatch = (opponentName) => {
  if (!opponentName) {
    opponentName = availableOpponents.value[Math.floor(Math.random() * availableOpponents.value.length)]
  }

  currentMatch.value = {
    active: true,
    opponent: opponentName,
    homeTeam: currentMatch.value.isHome ? teamName.value : opponentName,
    awayTeam: currentMatch.value.isHome ? opponentName : teamName.value,
    homeGoals: 0,
    homeBehinds: 0,
    awayGoals: 0,
    awayBehinds: 0,
    quarter: 1,
    minute: 0,
    events: [],
    isHome: currentMatch.value.isHome
  }

  simulateMatch()
}

const simulateMatch = () => {
  if (!currentMatch.value.active) return

  const interval = setInterval(() => {
    // AFL match is 4 quarters of 30 minutes each (120 minutes total)
    if (currentMatch.value.minute >= 120) {
      clearInterval(interval)
      endMatch()
      return
    }

    currentMatch.value.minute++

    // Update quarter display
    currentMatch.value.quarter = Math.ceil(currentMatch.value.minute / 30)

    // Quarter time breaks (skip scoring during these times)
    const minuteInQuarter = currentMatch.value.minute % 30
    if (minuteInQuarter === 0) {
      currentMatch.value.events.unshift({
        minute: currentMatch.value.minute,
        type: 'quarter',
        message: `🔔 End of Quarter ${currentMatch.value.quarter - 1}`
      })
    }

    // Random events during match
    const eventChance = Math.random()

    // Scoring chance (AFL is higher scoring - approximately every 3-4 minutes)
    if (eventChance > 0.95) {
      const isHomeScore = Math.random() > 0.5
      const scoringTeam = isHomeScore ? currentMatch.value.homeTeam : currentMatch.value.awayTeam
      const isGoal = Math.random() > 0.25 // 75% goals, 25% behinds

      if (scoringTeam === teamName.value) {
        // Our team scores
        const scorers = squad.value.filter(p => ['FF', 'CHF', 'HFF', 'RV', 'RR'].includes(p.position))
        const scorer = scorers[Math.floor(Math.random() * scorers.length)]

        if (isGoal) {
          if (isHomeScore) {
            currentMatch.value.homeGoals++
          } else {
            currentMatch.value.awayGoals++
          }
          scorer.goals++

          currentMatch.value.events.unshift({
            minute: currentMatch.value.minute,
            quarter: currentMatch.value.quarter,
            type: 'goal',
            team: scoringTeam,
            player: scorer.name,
            message: `🏉 GOAL! ${scorer.name} kicks a major!`
          })
        } else {
          if (isHomeScore) {
            currentMatch.value.homeBehinds++
          } else {
            currentMatch.value.awayBehinds++
          }
          scorer.behinds++

          currentMatch.value.events.unshift({
            minute: currentMatch.value.minute,
            quarter: currentMatch.value.quarter,
            type: 'behind',
            team: scoringTeam,
            player: scorer.name,
            message: `Behind to ${scorer.name}`
          })
        }
      } else {
        // Opponent scores
        if (isGoal) {
          if (isHomeScore) {
            currentMatch.value.homeGoals++
          } else {
            currentMatch.value.awayGoals++
          }

          currentMatch.value.events.unshift({
            minute: currentMatch.value.minute,
            quarter: currentMatch.value.quarter,
            type: 'goal',
            team: scoringTeam,
            message: `🏉 Goal to ${scoringTeam}`
          })
        } else {
          if (isHomeScore) {
            currentMatch.value.homeBehinds++
          } else {
            currentMatch.value.awayBehinds++
          }

          currentMatch.value.events.unshift({
            minute: currentMatch.value.minute,
            quarter: currentMatch.value.quarter,
            type: 'behind',
            team: scoringTeam,
            message: `Behind to ${scoringTeam}`
          })
        }
      }
    }

    // Injury chance (rare)
    if (eventChance > 0.998) {
      const randomPlayer = squad.value[Math.floor(Math.random() * squad.value.length)]
      randomPlayer.injured = true
      currentMatch.value.events.unshift({
        minute: currentMatch.value.minute,
        quarter: currentMatch.value.quarter,
        type: 'injury',
        player: randomPlayer.name,
        message: `🚑 ${randomPlayer.name} is injured!`
      })
    }
  }, simulationSpeed.value)
}

const endMatch = () => {
  currentMatch.value.active = false

  // Update player stats
  squad.value.forEach(player => {
    if (!player.injured) {
      player.matches++
    }
  })

  // Calculate AFL scores (goals * 6 + behinds)
  const homeTotal = currentMatch.value.homeGoals * 6 + currentMatch.value.homeBehinds
  const awayTotal = currentMatch.value.awayGoals * 6 + currentMatch.value.awayBehinds

  // Update standings
  const ourTeam = standings.value.find(t => t.team === teamName.value)
  const opponentTeam = standings.value.find(t => t.team === currentMatch.value.opponent)

  const ourScore = currentMatch.value.isHome ? homeTotal : awayTotal
  const theirScore = currentMatch.value.isHome ? awayTotal : homeTotal

  // Update our team
  ourTeam.played++
  ourTeam.pointsFor += ourScore
  ourTeam.pointsAgainst += theirScore

  // Update opponent
  opponentTeam.played++
  opponentTeam.pointsFor += theirScore
  opponentTeam.pointsAgainst += ourScore

  if (ourScore > theirScore) {
    ourTeam.won++
    ourTeam.premiership += 4 // 4 premiership points for a win
    opponentTeam.lost++
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🏆 Victory! Final: ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeTotal}) - ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayTotal})`
    })
  } else if (ourScore < theirScore) {
    ourTeam.lost++
    opponentTeam.won++
    opponentTeam.premiership += 4
    currentMatch.value.events.unshift({
      type: 'result',
      message: `😞 Defeat. Final: ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeTotal}) - ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayTotal})`
    })
  } else {
    ourTeam.drawn++
    ourTeam.premiership += 2 // 2 premiership points for a draw
    opponentTeam.drawn++
    opponentTeam.premiership += 2
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🤝 Draw! Final: ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeTotal}) - ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayTotal})`
    })
  }

  // Calculate percentage (AFL style: pointsFor / pointsAgainst * 100)
  ourTeam.percentage = ourTeam.pointsAgainst > 0 ? (ourTeam.pointsFor / ourTeam.pointsAgainst * 100).toFixed(2) : 100
  opponentTeam.percentage = opponentTeam.pointsAgainst > 0 ? (opponentTeam.pointsFor / opponentTeam.pointsAgainst * 100).toFixed(2) : 100

  // Add match day revenue
  const attendance = Math.floor(Math.random() * 30000) + 20000
  const matchRevenue = attendance * 50 // $50 per ticket
  finances.value.matchDayRevenue += matchRevenue
  budget.value += matchRevenue

  // Generate match report for inbox
  const result = ourScore > theirScore ? 'Victory' : ourScore < theirScore ? 'Defeat' : 'Draw'
  addInboxMessage({
    from: 'Match Report',
    subject: `${result} vs ${currentMatch.value.opponent}`,
    message: `Final Score: ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeTotal}) - ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayTotal}). Attendance: ${attendance.toLocaleString()}. Revenue: $${matchRevenue.toLocaleString()}`,
    type: 'match'
  })

  // Toggle home/away for next match
  currentMatch.value.isHome = !currentMatch.value.isHome
}

const healAllPlayers = () => {
  squad.value.forEach(player => {
    player.injured = false
  })
}

const resetSeason = () => {
  // Reset standings
  standings.value.forEach(team => {
    team.played = 0
    team.won = 0
    team.drawn = 0
    team.lost = 0
    team.pointsFor = 0
    team.pointsAgainst = 0
    team.percentage = 100
    team.premiership = 0
  })

  // Reset player stats
  squad.value.forEach(player => {
    player.goals = 0
    player.behinds = 0
    player.matches = 0
    player.injured = false
  })

  currentMatch.value = {
    active: false,
    opponent: '',
    homeTeam: teamName.value,
    awayTeam: '',
    homeGoals: 0,
    homeBehinds: 0,
    awayGoals: 0,
    awayBehinds: 0,
    quarter: 1,
    minute: 0,
    events: [],
    isHome: true
  }
}

// Inbox/Media functions
const addInboxMessage = (messageData) => {
  inbox.value.unshift({
    id: nextInboxId.value++,
    date: `Week ${finances.value.week}`,
    read: false,
    ...messageData
  })
}

const markAsRead = (messageId) => {
  const message = inbox.value.find(m => m.id === messageId)
  if (message) {
    message.read = true
  }
}

const deleteMessage = (messageId) => {
  const index = inbox.value.findIndex(m => m.id === messageId)
  if (index !== -1) {
    inbox.value.splice(index, 1)
  }
}

// Staff management functions
const fireStaff = (staffId) => {
  const staffIndex = staff.value.findIndex(s => s.id === staffId)
  if (staffIndex !== -1) {
    const staffMember = staff.value[staffIndex]
    staff.value.splice(staffIndex, 1)
    addInboxMessage({
      from: 'HR Department',
      subject: `${staffMember.name} Released`,
      message: `${staffMember.name} (${staffMember.role}) has been released from their contract.`,
      type: 'staff'
    })
  }
}

const boostStaffMorale = (staffId) => {
  const staffMember = staff.value.find(s => s.id === staffId)
  if (staffMember && budget.value >= 10000) {
    budget.value -= 10000
    staffMember.morale = Math.min(100, staffMember.morale + 10)
    addInboxMessage({
      from: 'HR Department',
      subject: 'Staff Bonus Paid',
      message: `You paid a $10,000 bonus to ${staffMember.name}. Their morale improved!`,
      type: 'staff'
    })
  }
}

// Financial functions
const processWeeklyFinances = () => {
  finances.value.week++

  // Deduct weekly wages
  budget.value -= totalWeeklyWages.value
  finances.value.totalExpenses += totalWeeklyWages.value

  // Add weekly income
  budget.value += finances.value.weeklyIncome
  finances.value.totalIncome += finances.value.weeklyIncome

  // Generate weekly report
  addInboxMessage({
    from: 'Finance Department',
    subject: `Week ${finances.value.week} Financial Report`,
    message: `Income: $${finances.value.weeklyIncome.toLocaleString()}\nWages: $${totalWeeklyWages.value.toLocaleString()}\nNet: $${weeklyBalance.value.toLocaleString()}\n\nCurrent Balance: $${budget.value.toLocaleString()}`,
    type: 'finance'
  })

  // Generate random news/events
  generateRandomNews()
}

// Chat functions
const selectChatPerson = (person, type) => {
  chatPerson.value = { ...person, type }
  const personKey = `${type}-${person.id}`

  // Initialize chat history if doesn't exist
  if (!chatHistory.value[personKey]) {
    chatHistory.value[personKey] = [{
      from: 'person',
      message: type === 'player'
        ? chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)]
        : chatResponses.staff[Math.floor(Math.random() * chatResponses.staff.length)],
      timestamp: new Date().toLocaleTimeString()
    }]
  }
}

const sendChatMessage = () => {
  if (!chatInput.value.trim() || !chatPerson.value) return

  const personKey = `${chatPerson.value.type}-${chatPerson.value.id}`
  const message = chatInput.value.trim()

  // Add user message
  chatHistory.value[personKey].push({
    from: 'user',
    message: message,
    timestamp: new Date().toLocaleTimeString()
  })

  // Generate response based on message content
  setTimeout(() => {
    const response = generateChatResponse(message, chatPerson.value)
    chatHistory.value[personKey].push({
      from: 'person',
      message: response,
      timestamp: new Date().toLocaleTimeString()
    })
  }, 500 + Math.random() * 1000) // Simulate typing delay

  chatInput.value = ''
}

const generateChatResponse = (userMessage, person) => {
  const msg = userMessage.toLowerCase()

  // Check message content and return appropriate response
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)]
  } else if (msg.includes('perform') || msg.includes('form') || msg.includes('play')) {
    return chatResponses.performance[Math.floor(Math.random() * chatResponses.performance.length)]
  } else if (msg.includes('morale') || msg.includes('feel') || msg.includes('happy')) {
    return chatResponses.morale[Math.floor(Math.random() * chatResponses.morale.length)]
  } else if (msg.includes('transfer') || msg.includes('leave') || msg.includes('stay')) {
    return chatResponses.transfer[Math.floor(Math.random() * chatResponses.transfer.length)]
  } else if (msg.includes('injury') || msg.includes('injured') || msg.includes('hurt')) {
    if (person.type === 'player' && person.injured) {
      return chatResponses.injury[Math.floor(Math.random() * chatResponses.injury.length)]
    }
    return "Thankfully I'm feeling fit and healthy, coach!"
  } else if (msg.includes('tactic') || msg.includes('strategy') || msg.includes('game plan')) {
    return chatResponses.tactics[Math.floor(Math.random() * chatResponses.tactics.length)]
  } else if (person.type === 'staff') {
    return chatResponses.staff[Math.floor(Math.random() * chatResponses.staff.length)]
  }

  // Default responses
  const defaultResponses = [
    "Absolutely, coach!",
    "I'll do my best for the team.",
    "Thanks for the chat, coach.",
    "Good point, I'll keep that in mind.",
    "That's what I'm here for!",
    "Let's get after it, coach!",
    "The team comes first, always.",
    "I appreciate you checking in, coach."
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// Enhanced news generation
const generateRandomNews = () => {
  // 30% chance to generate a news story each week
  if (Math.random() < 0.3) {
    const category = newsTemplates[Math.floor(Math.random() * newsTemplates.length)]
    const template = category.templates[Math.floor(Math.random() * category.templates.length)]

    const subjects = {
      league: 'AFL News',
      rivalry: 'Match Preview',
      sponsor: 'Commercial Department',
      fan: 'Fan Relations',
      board: 'Board of Directors',
      rumor: 'Transfer Rumors'
    }

    addInboxMessage({
      from: subjects[category.type] || 'AFL Media',
      subject: template.substring(0, 50) + (template.length > 50 ? '...' : ''),
      message: template,
      type: 'news'
    })
  }

  // Random player/staff messages
  if (Math.random() < 0.2) {
    const randomPlayer = squad.value[Math.floor(Math.random() * squad.value.length)]
    const messages = [
      `Coach, just wanted to let you know I'm feeling really good in training!`,
      `Thanks for the faith you've shown in me. I won't let you down!`,
      `The boys and I are ready to give everything for the club.`,
      `Training has been intense but we're all benefiting from it.`
    ]

    addInboxMessage({
      from: randomPlayer.name,
      subject: 'Quick Message',
      message: messages[Math.floor(Math.random() * messages.length)],
      type: 'news'
    })
  }
}

// Calendar and Fixture functions
const generateFixtures = () => {
  if (fixturesGenerated.value) return

  const opponents = availableOpponents.value
  const allFixtures = []
  let matchId = 1

  // Generate round-robin fixtures (each team plays each other twice - home and away)
  for (let round = 1; round <= calendar.value.totalRounds; round++) {
    // Alternate home/away each round
    const isHome = round % 2 === 1
    const opponentIndex = (round - 1) % opponents.length
    const opponent = opponents[opponentIndex]

    // Matches on Day 7 of each round (weekend)
    const matchDay = (round - 1) * calendar.value.daysPerRound + 7

    allFixtures.push({
      id: matchId++,
      round: round,
      day: matchDay,
      homeTeam: isHome ? teamName.value : opponent,
      awayTeam: isHome ? opponent : teamName.value,
      played: false,
      homeScore: 0,
      awayScore: 0
    })
  }

  fixtures.value = allFixtures
  fixturesGenerated.value = true
}

const upcomingFixtures = computed(() => {
  return fixtures.value
    .filter(f => !f.played && f.day >= calendar.value.currentDay)
    .sort((a, b) => a.day - b.day)
    .slice(0, 5)
})

const nextMatch = computed(() => {
  return upcomingFixtures.value[0] || null
})

const simulateDay = () => {
  calendar.value.currentDay++

  // Check if there's a match today
  const todayMatch = fixtures.value.find(f => f.day === calendar.value.currentDay && !f.played)

  if (todayMatch) {
    // Auto-play the match
    const isHome = todayMatch.homeTeam === teamName.value
    currentMatch.value.isHome = isHome
    startMatch(isHome ? todayMatch.awayTeam : todayMatch.homeTeam)
    todayMatch.played = true

    addInboxMessage({
      from: 'Match Day',
      subject: `Match Day: ${todayMatch.homeTeam} vs ${todayMatch.awayTeam}`,
      message: `Today's match is being played. Check the Match tab for live updates!`,
      type: 'match'
    })
  }

  // Training improvements (every 3 days)
  if (calendar.value.currentDay % 3 === 0) {
    applyTraining()
  }

  // Random events (5% chance per day)
  if (Math.random() < 0.05) {
    generateRandomEvent()
  }

  // Update current round
  calendar.value.currentRound = Math.ceil(calendar.value.currentDay / calendar.value.daysPerRound)

  // Generate news occasionally
  if (Math.random() < 0.1) {
    generateRandomNews()
  }
}

const simulateWeek = () => {
  for (let i = 0; i < 7; i++) {
    simulateDay()
  }
  processWeeklyFinances()

  addInboxMessage({
    from: 'Weekly Summary',
    subject: `Week ${Math.ceil(calendar.value.currentDay / 7)} Complete`,
    message: `Another week in the books! Current day: ${calendar.value.currentDay}, Round: ${calendar.value.currentRound}`,
    type: 'news'
  })
}

const applyTraining = () => {
  const intensityBonus = {
    low: 0.1,
    medium: 0.2,
    high: 0.3
  }

  const bonus = intensityBonus[training.value.intensity]

  squad.value.forEach(player => {
    if (!player.injured && Math.random() < bonus) {
      // Small chance to improve overall rating
      if (player.overall < 95) {
        player.overall += 1
      }
    }

    // Heal injuries over time
    if (player.injured && Math.random() < 0.15) {
      player.injured = false
      addInboxMessage({
        from: 'Medical Team',
        subject: `${player.name} Returns from Injury`,
        message: `Good news! ${player.name} has recovered from injury and is available for selection.`,
        type: 'news'
      })
    }
  })
}

const generateRandomEvent = () => {
  const events = [
    () => {
      // Random player form boost
      const player = squad.value[Math.floor(Math.random() * squad.value.length)]
      addInboxMessage({
        from: 'Performance Analysis',
        subject: `${player.name} Showing Great Form`,
        message: `${player.name} has been impressive in training this week! The coaching staff are very pleased.`,
        type: 'news'
      })
    },
    () => {
      // Minor injury (10% chance)
      if (Math.random() < 0.1) {
        const healthyPlayers = squad.value.filter(p => !p.injured)
        if (healthyPlayers.length > 0) {
          const player = healthyPlayers[Math.floor(Math.random() * healthyPlayers.length)]
          player.injured = true
          addInboxMessage({
            from: 'Medical Team',
            subject: `Injury Update: ${player.name}`,
            message: `Unfortunately, ${player.name} picked up an injury in training. Expected to be out for 1-2 weeks.`,
            type: 'news'
          })
        }
      }
    },
    () => {
      // Budget bonus
      const bonus = Math.floor(Math.random() * 500000) + 100000
      budget.value += bonus
      addInboxMessage({
        from: 'Commercial Department',
        subject: 'Unexpected Revenue',
        message: `Great news! A new sponsorship deal has brought in $${bonus.toLocaleString()} for the club.`,
        type: 'finance'
      })
    }
  ]

  const event = events[Math.floor(Math.random() * events.length)]
  event()
}
</script>

<template>
  <div class="football-manager">
    <header class="manager-header">
      <h1>🏉 {{ teamName }}</h1>
      <div class="header-stats">
        <span class="stat">Overall: {{ teamOverall }}</span>
        <span class="stat">Budget: ${{ (budget / 1000000).toFixed(1) }}M</span>
        <span class="stat">Reputation: {{ reputation }}</span>
      </div>
    </header>

    <nav class="tabs">
      <button
        @click="activeTab = 'squad'"
        :class="{ active: activeTab === 'squad' }">
        Squad
      </button>
      <button
        @click="activeTab = 'match'"
        :class="{ active: activeTab === 'match' }">
        Match
      </button>
      <button
        @click="activeTab = 'standings'"
        :class="{ active: activeTab === 'standings' }">
        League
      </button>
      <button
        @click="activeTab = 'stats'"
        :class="{ active: activeTab === 'stats' }">
        Statistics
      </button>
      <button
        @click="activeTab = 'inbox'"
        :class="{ active: activeTab === 'inbox' }">
        Inbox
        <span v-if="unreadMessages > 0" class="badge">{{ unreadMessages }}</span>
      </button>
      <button
        @click="activeTab = 'staff'"
        :class="{ active: activeTab === 'staff' }">
        Staff
      </button>
      <button
        @click="activeTab = 'finances'"
        :class="{ active: activeTab === 'finances' }">
        Finances
      </button>
      <button
        @click="activeTab = 'chat'"
        :class="{ active: activeTab === 'chat' }">
        Chat
      </button>
      <button
        @click="activeTab = 'calendar'"
        :class="{ active: activeTab === 'calendar' }">
        Calendar
      </button>
    </nav>

    <!-- Squad Tab -->
    <div v-if="activeTab === 'squad'" class="tab-content">
      <div class="squad-controls">
        <button @click="healAllPlayers" class="action-btn">🏥 Heal All Players</button>
      </div>

      <div class="squad-grid">
        <div
          v-for="player in squad"
          :key="player.id"
          class="player-card"
          :class="{ injured: player.injured }">
          <div class="player-header">
            <span class="player-position">{{ player.position }}</span>
            <span class="player-overall">{{ player.overall }}</span>
          </div>
          <h3>{{ player.name }}</h3>
          <div class="player-stats">
            <span>Age: {{ player.age }}</span>
            <span>Value: ${{ (player.value / 1000000).toFixed(1) }}M</span>
          </div>
          <div class="player-performance">
            <span>🏉 {{ player.goals }}</span>
            <span>📊 {{ player.behinds }}</span>
            <span>🎮 {{ player.matches }}</span>
          </div>
          <div v-if="player.injured" class="injury-badge">🚑 INJURED</div>
        </div>
      </div>
    </div>

    <!-- Match Tab -->
    <div v-if="activeTab === 'match'" class="tab-content">
      <div v-if="!currentMatch.active" class="match-setup">
        <h2>Start New Match</h2>
        <div class="opponent-select">
          <button
            v-for="opponent in availableOpponents"
            :key="opponent"
            @click="startMatch(opponent)"
            class="opponent-btn">
            vs {{ opponent }}
          </button>
        </div>
        <button @click="startMatch()" class="action-btn random-match">
          ⚡ Random Match
        </button>
      </div>

      <div v-else class="match-simulation">
        <div class="scoreboard">
          <div class="team home">
            <h2>{{ currentMatch.homeTeam }}</h2>
            <div class="score-display">
              <span class="score-line">{{ currentMatch.homeGoals }}.{{ currentMatch.homeBehinds }}</span>
              <span class="total-score">({{ currentMatch.homeGoals * 6 + currentMatch.homeBehinds }})</span>
            </div>
          </div>
          <div class="match-time">
            <span class="quarter-label">Q{{ currentMatch.quarter }}</span>
            <span class="minute">{{ currentMatch.minute % 30 || 30 }}'</span>
          </div>
          <div class="team away">
            <h2>{{ currentMatch.awayTeam }}</h2>
            <div class="score-display">
              <span class="score-line">{{ currentMatch.awayGoals }}.{{ currentMatch.awayBehinds }}</span>
              <span class="total-score">({{ currentMatch.awayGoals * 6 + currentMatch.awayBehinds }})</span>
            </div>
          </div>
        </div>

        <div class="match-events">
          <h3>Match Events</h3>
          <div class="events-list">
            <div
              v-for="(event, index) in currentMatch.events"
              :key="index"
              class="event"
              :class="event.type">
              <span class="event-minute">{{ event.minute }}'</span>
              <span class="event-message">{{ event.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Standings Tab -->
    <div v-if="activeTab === 'standings'" class="tab-content">
      <div class="standings-controls">
        <button @click="resetSeason" class="action-btn">🔄 Reset Season</button>
      </div>

      <table class="standings-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>%</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(team, index) in sortedStandings"
            :key="team.team"
            :class="{ 'our-team': team.team === teamName }">
            <td>{{ index + 1 }}</td>
            <td class="team-name">{{ team.team }}</td>
            <td>{{ team.played }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.drawn }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.pointsFor }}</td>
            <td>{{ team.pointsAgainst }}</td>
            <td :class="{ positive: team.percentage > 100, negative: team.percentage < 100 }">
              {{ team.percentage }}
            </td>
            <td class="points">{{ team.premiership }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Statistics Tab -->
    <div v-if="activeTab === 'stats'" class="tab-content">
      <div class="stats-section">
        <h2>Top Goal Kickers</h2>
        <div v-if="topScorers.length === 0" class="empty-state">
          No goals kicked yet. Play some matches!
        </div>
        <div v-else class="top-scorers">
          <div
            v-for="(player, index) in topScorers"
            :key="player.id"
            class="scorer-row">
            <span class="rank">{{ index + 1 }}</span>
            <span class="scorer-name">{{ player.name }}</span>
            <span class="scorer-position">{{ player.position }}</span>
            <span class="scorer-goals">🏉 {{ player.goals }}</span>
          </div>
        </div>

        <h2 style="margin-top: 2rem;">Squad Overview</h2>
        <div class="squad-overview">
          <div class="overview-stat">
            <h3>{{ squad.length }}</h3>
            <p>Players</p>
          </div>
          <div class="overview-stat">
            <h3>{{ teamOverall }}</h3>
            <p>Team Rating</p>
          </div>
          <div class="overview-stat">
            <h3>{{ squad.filter(p => p.injured).length }}</h3>
            <p>Injured</p>
          </div>
          <div class="overview-stat">
            <h3>${{ (squad.reduce((sum, p) => sum + p.value, 0) / 1000000).toFixed(0) }}M</h3>
            <p>Squad Value</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Inbox Tab -->
    <div v-if="activeTab === 'inbox'" class="tab-content">
      <div class="inbox-header">
        <h2>Inbox</h2>
        <span class="unread-count">{{ unreadMessages }} unread</span>
      </div>

      <div class="inbox-list">
        <div v-if="inbox.length === 0" class="empty-state">
          No messages yet!
        </div>
        <div
          v-for="message in inbox"
          :key="message.id"
          class="message-card"
          :class="{ unread: !message.read }"
          @click="markAsRead(message.id)">
          <div class="message-header">
            <span class="message-from">{{ message.from }}</span>
            <span class="message-date">{{ message.date }}</span>
          </div>
          <h3 class="message-subject">{{ message.subject }}</h3>
          <p class="message-preview">{{ message.message }}</p>
          <div class="message-actions">
            <span :class="`message-type type-${message.type}`">{{ message.type }}</span>
            <button @click.stop="deleteMessage(message.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Tab -->
    <div v-if="activeTab === 'staff'" class="tab-content">
      <div class="staff-header">
        <h2>Coaching Staff</h2>
        <p class="staff-count">{{ staff.length }} staff members</p>
      </div>

      <div class="staff-grid">
        <div
          v-for="member in staff"
          :key="member.id"
          class="staff-card">
          <div class="staff-header-info">
            <h3>{{ member.name }}</h3>
            <span class="staff-role">{{ member.role }}</span>
          </div>
          <div class="staff-stats">
            <div class="stat-item">
              <span class="stat-label">Rating</span>
              <span class="stat-value">{{ member.rating }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Morale</span>
              <span class="stat-value" :class="{ low: member.morale < 50, medium: member.morale >= 50 && member.morale < 75, high: member.morale >= 75 }">
                {{ member.morale }}%
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Salary</span>
              <span class="stat-value">${{ (member.salary / 1000).toFixed(0) }}k/yr</span>
            </div>
          </div>
          <div class="staff-actions">
            <button @click="boostStaffMorale(member.id)" class="action-btn small">
              Bonus ($10k)
            </button>
            <button @click="fireStaff(member.id)" class="action-btn small danger">
              Release
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Finances Tab -->
    <div v-if="activeTab === 'finances'" class="tab-content">
      <div class="finances-header">
        <h2>Financial Overview</h2>
        <button @click="processWeeklyFinances" class="action-btn">Advance Week</button>
      </div>

      <div class="finance-summary">
        <div class="finance-card">
          <h3>Current Balance</h3>
          <p class="finance-amount">${{ (budget / 1000000).toFixed(2) }}M</p>
        </div>
        <div class="finance-card">
          <h3>Week {{ finances.week }}</h3>
          <p class="finance-label">Current Week</p>
        </div>
        <div class="finance-card">
          <h3>${{ (totalWeeklyWages / 1000).toFixed(1) }}k</h3>
          <p class="finance-label">Weekly Wages</p>
        </div>
        <div class="finance-card">
          <h3 :class="{ positive: weeklyBalance > 0, negative: weeklyBalance < 0 }">
            ${{ (weeklyBalance / 1000).toFixed(1) }}k
          </h3>
          <p class="finance-label">Weekly Balance</p>
        </div>
      </div>

      <div class="finance-breakdown">
        <h3>Income & Expenses</h3>
        <div class="finance-table">
          <div class="finance-row">
            <span class="finance-label">Weekly Income</span>
            <span class="finance-value positive">${{ finances.weeklyIncome.toLocaleString() }}</span>
          </div>
          <div class="finance-row">
            <span class="finance-label">Player Wages</span>
            <span class="finance-value negative">-${{ Math.round(squad.reduce((sum, player) => sum + (player.value * 0.001), 0)).toLocaleString() }}</span>
          </div>
          <div class="finance-row">
            <span class="finance-label">Staff Wages</span>
            <span class="finance-value negative">-${{ Math.round(staff.reduce((sum, member) => sum + (member.salary / 52), 0)).toLocaleString() }}</span>
          </div>
          <div class="finance-row">
            <span class="finance-label">Match Day Revenue (Season)</span>
            <span class="finance-value positive">${{ finances.matchDayRevenue.toLocaleString() }}</span>
          </div>
          <div class="finance-row total">
            <span class="finance-label">Total Income (Season)</span>
            <span class="finance-value positive">${{ finances.totalIncome.toLocaleString() }}</span>
          </div>
          <div class="finance-row total">
            <span class="finance-label">Total Expenses (Season)</span>
            <span class="finance-value negative">-${{ finances.totalExpenses.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Tab -->
    <div v-if="activeTab === 'chat'" class="tab-content">
      <div class="chat-container">
        <!-- Contact List -->
        <div class="chat-sidebar">
          <h3>Players</h3>
          <div class="contact-list">
            <div
              v-for="player in squad"
              :key="`player-${player.id}`"
              class="contact-item"
              :class="{ active: chatPerson?.type === 'player' && chatPerson?.id === player.id }"
              @click="selectChatPerson(player, 'player')">
              <div class="contact-info">
                <span class="contact-name">{{ player.name }}</span>
                <span class="contact-role">{{ player.position }}</span>
              </div>
              <span class="contact-status" :class="{ injured: player.injured }">
                {{ player.injured ? '🚑' : '✓' }}
              </span>
            </div>
          </div>

          <h3 style="margin-top: 1.5rem;">Staff</h3>
          <div class="contact-list">
            <div
              v-for="member in staff"
              :key="`staff-${member.id}`"
              class="contact-item"
              :class="{ active: chatPerson?.type === 'staff' && chatPerson?.id === member.id }"
              @click="selectChatPerson(member, 'staff')">
              <div class="contact-info">
                <span class="contact-name">{{ member.name }}</span>
                <span class="contact-role">{{ member.role }}</span>
              </div>
              <span class="contact-status">👤</span>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="chat-window">
          <div v-if="!chatPerson" class="chat-empty">
            <h2>💬 Team Chat</h2>
            <p>Select a player or staff member to start chatting</p>
          </div>

          <div v-else class="chat-active">
            <div class="chat-header">
              <div>
                <h3>{{ chatPerson.name }}</h3>
                <span class="chat-subtitle">
                  {{ chatPerson.type === 'player' ? chatPerson.position : chatPerson.role }}
                </span>
              </div>
            </div>

            <div class="chat-messages">
              <div
                v-for="(msg, index) in chatHistory[`${chatPerson.type}-${chatPerson.id}`] || []"
                :key="index"
                class="message"
                :class="msg.from">
                <div class="message-bubble">
                  <p>{{ msg.message }}</p>
                  <span class="message-time">{{ msg.timestamp }}</span>
                </div>
              </div>
            </div>

            <div class="chat-input-container">
              <input
                v-model="chatInput"
                @keyup.enter="sendChatMessage"
                type="text"
                placeholder="Type a message..."
                class="chat-input"
              />
              <button @click="sendChatMessage" class="send-btn">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Tab -->
    <div v-if="activeTab === 'calendar'" class="tab-content">
      <div class="calendar-header">
        <div class="calendar-info">
          <h2>Season {{ calendar.season }}</h2>
          <div class="calendar-stats">
            <span class="calendar-stat">Day {{ calendar.currentDay }}</span>
            <span class="calendar-stat">Round {{ calendar.currentRound }}/{{ calendar.totalRounds }}</span>
            <span class="calendar-stat">Week {{ Math.ceil(calendar.currentDay / 7) }}</span>
          </div>
        </div>
        <div class="calendar-controls">
          <button @click="generateFixtures" v-if="!fixturesGenerated" class="action-btn">
            Generate Fixtures
          </button>
          <button @click="simulateDay" class="action-btn">Simulate Day</button>
          <button @click="simulateWeek" class="action-btn">Simulate Week</button>
        </div>
      </div>

      <!-- Next Match Preview -->
      <div v-if="nextMatch" class="next-match-card">
        <h3>🏉 Next Match - Day {{ nextMatch.day }} (Round {{ nextMatch.round }})</h3>
        <div class="match-preview">
          <div class="team-preview">
            <h4>{{ nextMatch.homeTeam }}</h4>
            <span class="home-label">HOME</span>
          </div>
          <div class="vs">VS</div>
          <div class="team-preview">
            <h4>{{ nextMatch.awayTeam }}</h4>
            <span class="away-label">AWAY</span>
          </div>
        </div>
        <p class="days-until">{{ nextMatch.day - calendar.currentDay }} days until match</p>
      </div>

      <!-- Training Settings -->
      <div class="training-settings">
        <h3>⚡ Training Settings</h3>
        <div class="training-controls">
          <div class="training-option">
            <label>Intensity:</label>
            <select v-model="training.intensity" class="training-select">
              <option value="low">Low (Less fatigue, slower improvement)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Faster improvement, more fatigue)</option>
            </select>
          </div>
          <div class="training-option">
            <label>Focus:</label>
            <select v-model="training.focus" class="training-select">
              <option value="balanced">Balanced</option>
              <option value="attack">Attack</option>
              <option value="defense">Defense</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Fixture List -->
      <div class="fixtures-section">
        <h3>Upcoming Fixtures</h3>
        <div v-if="!fixturesGenerated" class="empty-state">
          Click "Generate Fixtures" to create the season schedule
        </div>
        <div v-else class="fixtures-list">
          <div
            v-for="fixture in upcomingFixtures"
            :key="fixture.id"
            class="fixture-card">
            <div class="fixture-round">Round {{ fixture.round }}</div>
            <div class="fixture-details">
              <div class="fixture-teams">
                <span :class="{ 'our-team': fixture.homeTeam === teamName }">
                  {{ fixture.homeTeam }}
                </span>
                <span class="fixture-vs">vs</span>
                <span :class="{ 'our-team': fixture.awayTeam === teamName }">
                  {{ fixture.awayTeam }}
                </span>
              </div>
              <div class="fixture-day">Day {{ fixture.day }}</div>
            </div>
          </div>
        </div>

        <h3 style="margin-top: 2rem;">Recent Results</h3>
        <div class="fixtures-list">
          <div v-if="fixtures.filter(f => f.played).length === 0" class="empty-state">
            No matches played yet
          </div>
          <div
            v-for="fixture in fixtures.filter(f => f.played).slice(-5).reverse()"
            :key="fixture.id"
            class="fixture-card played">
            <div class="fixture-round">Round {{ fixture.round }}</div>
            <div class="fixture-details">
              <div class="fixture-teams">
                <span :class="{ 'our-team': fixture.homeTeam === teamName }">
                  {{ fixture.homeTeam }}
                </span>
                <span class="fixture-score">{{ fixture.homeScore }} - {{ fixture.awayScore }}</span>
                <span :class="{ 'our-team': fixture.awayTeam === teamName }">
                  {{ fixture.awayTeam }}
                </span>
              </div>
              <div class="fixture-day">Day {{ fixture.day }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.football-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.manager-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.manager-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.header-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-stats .stat {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.tabs button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tabs button.active {
  color: #1e3c72;
  border-bottom-color: #1e3c72;
  font-weight: 600;
}

.tabs button:hover {
  background: rgba(30, 60, 114, 0.05);
}

.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Squad Grid */
.squad-controls {
  margin-bottom: 1.5rem;
}

.squad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.player-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s;
}

.player-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1e3c72;
}

.player-card.injured {
  opacity: 0.6;
  background: #fff5f5;
  border-color: #ff6b6b;
}

.player-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.player-position {
  background: #1e3c72;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.player-overall {
  background: #ffd700;
  color: #1e3c72;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
}

.player-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.player-stats,
.player-performance {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

.player-performance {
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  font-weight: 600;
}

.injury-badge {
  background: #ff6b6b;
  color: white;
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Match Simulation */
.match-setup {
  text-align: center;
  padding: 2rem;
}

.match-setup h2 {
  margin-bottom: 2rem;
  color: #333;
}

.opponent-select {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.opponent-btn {
  padding: 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s;
}

.opponent-btn:hover {
  background: #1e3c72;
  color: white;
  border-color: #1e3c72;
  transform: translateY(-2px);
}

.action-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
}

.random-match {
  font-size: 1.2rem;
  padding: 1.5rem 3rem;
}

.match-simulation {
  padding: 1rem;
}

.scoreboard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.scoreboard .team {
  flex: 1;
  text-align: center;
}

.scoreboard .team h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.score-line {
  font-size: 3rem;
  font-weight: 700;
}

.total-score {
  font-size: 1.5rem;
  opacity: 0.9;
}

.match-time {
  flex: 0 0 120px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quarter-label {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.9;
}

.minute {
  font-size: 2rem;
  font-weight: 700;
}

.match-events {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
}

.match-events h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.events-list {
  max-height: 400px;
  overflow-y: auto;
}

.event {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid #e0e0e0;
  background: #f9f9f9;
  border-radius: 4px;
}

.event.goal {
  border-left-color: #4caf50;
  background: #f1f8f4;
}

.event.behind {
  border-left-color: #2196f3;
  background: #f1f8ff;
}

.event.quarter {
  border-left-color: #ff9800;
  background: #fff8f1;
  font-weight: 600;
}

.event.injury {
  border-left-color: #ff6b6b;
  background: #fff5f5;
}

.event.result {
  border-left-color: #ffd700;
  background: #fffef5;
  font-weight: 600;
}

.event-minute {
  font-weight: 700;
  color: #1e3c72;
  min-width: 40px;
}

.event-message {
  flex: 1;
}

/* Standings Table */
.standings-controls {
  margin-bottom: 1.5rem;
}

.standings-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.standings-table thead {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
}

.standings-table th,
.standings-table td {
  padding: 1rem;
  text-align: left;
}

.standings-table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.standings-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.standings-table tbody tr:hover {
  background: #f5f5f5;
}

.standings-table .our-team {
  background: #e3f2fd;
  font-weight: 600;
}

.standings-table .our-team:hover {
  background: #bbdefb;
}

.standings-table .team-name {
  font-weight: 600;
}

.standings-table .points {
  font-weight: 700;
  color: #1e3c72;
}

.standings-table .positive {
  color: #4caf50;
}

.standings-table .negative {
  color: #ff6b6b;
}

/* Statistics */
.stats-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.stats-section h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-style: italic;
}

.top-scorers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scorer-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.scorer-row:hover {
  border-color: #1e3c72;
  background: #f5f7fa;
}

.scorer-row .rank {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3c72;
  min-width: 40px;
}

.scorer-row .scorer-name {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.scorer-row .scorer-position {
  background: #1e3c72;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.scorer-row .scorer-goals {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4caf50;
}

.squad-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.overview-stat {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border-radius: 8px;
}

.overview-stat h3 {
  margin: 0;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.overview-stat p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Inbox Tab */
.inbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.inbox-header h2 {
  margin: 0;
  color: #333;
}

.unread-count {
  background: #ff6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.inbox-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.message-card.unread {
  background: #f1f8ff;
  border-color: #2196f3;
  font-weight: 600;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.message-from {
  font-weight: 600;
  color: #1e3c72;
}

.message-subject {
  margin: 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.message-preview {
  color: #666;
  line-height: 1.5;
  margin: 0.5rem 0;
  white-space: pre-line;
}

.message-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.message-type {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-news { background: #e3f2fd; color: #2196f3; }
.type-match { background: #e8f5e9; color: #4caf50; }
.type-staff { background: #fff8e1; color: #ff9800; }
.type-finance { background: #f3e5f5; color: #9c27b0; }

.delete-btn {
  padding: 0.5rem 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
}

.badge {
  background: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  font-weight: 700;
}

/* Staff Tab */
.staff-header {
  margin-bottom: 1.5rem;
}

.staff-header h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.staff-count {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.staff-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.staff-card:hover {
  border-color: #1e3c72;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.staff-header-info {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.staff-header-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.staff-role {
  background: #1e3c72;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.staff-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.stat-value.low { color: #ff6b6b; }
.stat-value.medium { color: #ff9800; }
.stat-value.high { color: #4caf50; }

.staff-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.small {
  padding: 0.625rem 1rem;
  font-size: 0.85rem;
  flex: 1;
}

.action-btn.danger {
  background: #ff6b6b;
}

.action-btn.danger:hover {
  background: #ff5252;
}

/* Finances Tab */
.finances-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.finances-header h2 {
  margin: 0;
  color: #333;
}

.finance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.finance-card {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.finance-card h3 {
  margin: 0;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.finance-amount {
  margin: 0.5rem 0 0 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.finance-label {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.finance-breakdown {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
}

.finance-breakdown h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.finance-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.finance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.finance-row.total {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.finance-row.total .finance-value {
  color: white;
}

.finance-value.positive {
  color: #4caf50;
  font-weight: 700;
}

.finance-value.negative {
  color: #ff6b6b;
  font-weight: 700;
}

h3.positive {
  color: #4caf50;
}

h3.negative {
  color: #ff6b6b;
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .football-manager {
    padding: 0.5rem;
  }

  /* Header */
  .manager-header {
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
  }

  .manager-header h1 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .header-stats {
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .header-stats .stat {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }

  /* Tabs */
  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin-bottom: 1rem;
    gap: 0.25rem;
  }

  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tabs button {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
    white-space: nowrap;
    min-width: auto;
  }

  /* Squad Grid */
  .squad-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .player-card {
    padding: 0.875rem;
  }

  .player-card h3 {
    font-size: 1rem;
  }

  .player-stats,
  .player-performance {
    font-size: 0.8rem;
  }

  /* Match Setup */
  .match-setup {
    padding: 1rem;
  }

  .match-setup h2 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .opponent-select {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .opponent-btn {
    padding: 1.25rem;
    font-size: 0.95rem;
    min-height: 56px; /* Touch-friendly height */
  }

  .random-match {
    padding: 1.25rem 2rem;
    font-size: 1.1rem;
    min-height: 56px;
  }

  /* Scoreboard */
  .match-simulation {
    padding: 0.5rem;
  }

  .scoreboard {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
  }

  .scoreboard .team h2 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .score-line {
    font-size: 2.5rem;
  }

  .total-score {
    font-size: 1.3rem;
  }

  .match-time {
    flex: none;
    width: 100%;
    padding: 0.75rem;
  }

  .quarter-label {
    font-size: 1rem;
  }

  .minute {
    font-size: 1.5rem;
  }

  /* Match Events */
  .match-events {
    padding: 1rem;
    margin-top: 1rem;
  }

  .match-events h3 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  .events-list {
    max-height: 300px;
  }

  .event {
    padding: 0.625rem;
    font-size: 0.85rem;
    flex-wrap: wrap;
  }

  .event-minute {
    min-width: 35px;
  }

  /* Standings Table */
  .standings-table {
    font-size: 0.8rem;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }

  .standings-table thead,
  .standings-table tbody,
  .standings-table tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  .standings-table th,
  .standings-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }

  .standings-table th:first-child,
  .standings-table td:first-child {
    width: 40px;
  }

  .standings-table .team-name {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Statistics */
  .stats-section {
    padding: 1rem;
  }

  .stats-section h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .scorer-row {
    padding: 0.875rem;
    font-size: 0.85rem;
    flex-wrap: wrap;
  }

  .scorer-row .rank {
    font-size: 1.3rem;
    min-width: 35px;
  }

  .scorer-row .scorer-goals {
    font-size: 1.1rem;
  }

  .squad-overview {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .overview-stat {
    padding: 1.25rem;
  }

  .overview-stat h3 {
    font-size: 2rem;
  }

  .overview-stat p {
    font-size: 0.8rem;
  }

  /* Action Buttons */
  .action-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
    min-height: 48px;
  }

  .squad-controls,
  .standings-controls {
    margin-bottom: 1rem;
  }

  /* New features mobile */
  .inbox-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .message-card {
    padding: 1rem;
  }

  .message-subject {
    font-size: 1rem;
  }

  .staff-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .staff-card {
    padding: 1.25rem;
  }

  .finances-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .finance-summary {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .finance-card h3 {
    font-size: 1.5rem;
  }

  .finance-amount {
    font-size: 2rem;
  }

  .finance-breakdown {
    padding: 1rem;
  }

  .finance-row {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .manager-header h1 {
    font-size: 1.3rem;
  }

  .header-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .tabs button {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }

  .score-line {
    font-size: 2rem;
  }

  .total-score {
    font-size: 1.1rem;
  }

  .squad-overview {
    grid-template-columns: 1fr;
  }

  .standings-table {
    font-size: 0.7rem;
  }

  .standings-table th,
  .standings-table td {
    padding: 0.625rem 0.4rem;
  }

  .finance-summary {
    grid-template-columns: 1fr;
  }

  .finance-card h3 {
    font-size: 1.3rem;
  }

  .finance-amount {
    font-size: 1.75rem;
  }

  .message-card {
    padding: 0.875rem;
  }

  /* Chat responsive */
  .chat-container {
    flex-direction: column;
  }

  .chat-sidebar {
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    border-right: none;
    border-bottom: 2px solid #e0e0e0;
  }

  .chat-window {
    width: 100%;
  }

  .contact-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Chat Styles */
.chat-container {
  display: flex;
  height: 600px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.chat-sidebar {
  width: 300px;
  border-right: 2px solid #e0e0e0;
  overflow-y: auto;
  background: #f9f9f9;
  padding: 1rem;
}

.chat-sidebar h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-item:hover {
  border-color: #1e3c72;
  background: #f5f7fa;
}

.contact-item.active {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border-color: #1e3c72;
}

.contact-item.active .contact-role {
  color: rgba(255, 255, 255, 0.8);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.contact-role {
  font-size: 0.75rem;
  color: #666;
}

.contact-status {
  font-size: 1.2rem;
}

.contact-status.injured {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}

.chat-empty h2 {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.chat-empty p {
  margin: 0;
  font-style: italic;
}

.chat-active {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
}

.chat-header h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
}

.chat-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f5f7fa;
}

.message {
  display: flex;
  gap: 0.75rem;
}

.message.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 0.875rem 1.25rem;
  border-radius: 18px;
  position: relative;
}

.message.person .message-bubble {
  background: white;
  border: 2px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble p {
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
}

.chat-input-container {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem;
  border-top: 2px solid #e0e0e0;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s;
}

.chat-input:focus {
  border-color: #1e3c72;
  background: #f9f9f9;
}

.send-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
  min-height: 48px;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
}

.send-btn:active {
  transform: translateY(0);
}

/* Calendar Styles */
.calendar-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.calendar-info h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
}

.calendar-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.calendar-stat {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
}

.calendar-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.next-match-card {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.next-match-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
}

.match-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin: 1.5rem 0;
}

.team-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.team-preview h4 {
  margin: 0;
  font-size: 1.5rem;
}

.home-label,
.away-label {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.vs {
  font-size: 1.5rem;
  font-weight: 700;
  opacity: 0.9;
}

.days-until {
  margin: 1rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.95;
}

.training-settings {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.training-settings h3 {
  margin: 0 0 1.25rem 0;
  color: #333;
}

.training-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.training-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.training-option label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.training-select {
  padding: 0.875rem 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.training-select:focus {
  outline: none;
  border-color: #1e3c72;
}

.fixtures-section {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
}

.fixtures-section h3 {
  margin: 0 0 1.25rem 0;
  color: #333;
}

.fixtures-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fixture-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s;
}

.fixture-card:hover {
  border-color: #1e3c72;
  background: #f5f7fa;
}

.fixture-card.played {
  background: #e8f5e9;
  border-color: #4caf50;
}

.fixture-round {
  background: #1e3c72;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 80px;
  text-align: center;
}

.fixture-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fixture-teams {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.fixture-vs {
  color: #999;
  font-size: 0.8rem;
}

.fixture-score {
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 700;
}

.fixture-day {
  color: #666;
  font-size: 0.85rem;
}

.fixture-teams .our-team {
  color: #1e3c72;
  font-weight: 700;
}
</style>
