<script setup>
import { ref, computed, watch } from 'vue'

// Game state
const activeTab = ref('squad')
const simulationSpeed = ref(400)

// Team data
const teamName = ref('Melbourne Demons')
const budget = ref(15000000)
const reputation = ref(75)

// Australian player names for authenticity
const squad = ref([
  // Full Forwards
  { id: 1, name: 'Jack Cameron', position: 'FF', overall: 92, age: 27, value: 1200000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 2, name: 'Tom McKenzie', position: 'FF', overall: 88, age: 25, value: 950000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },

  // Half Forwards
  { id: 3, name: 'Bailey Williams', position: 'CHF', overall: 90, age: 26, value: 1100000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 4, name: 'Lachlan Thompson', position: 'HFF', overall: 87, age: 24, value: 900000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 5, name: 'Cooper Anderson', position: 'HFF', overall: 86, age: 23, value: 850000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },

  // Midfielders
  { id: 6, name: 'Mitchell O\'Brien', position: 'Wing', overall: 91, age: 25, value: 1150000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 7, name: 'Ryan Murphy', position: 'Centre', overall: 93, age: 28, value: 1300000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 8, name: 'Callum Roberts', position: 'Wing', overall: 89, age: 26, value: 1000000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 9, name: 'Blake Patterson', position: 'Rover', overall: 90, age: 27, value: 1100000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },

  // Ruck
  { id: 10, name: 'Max Donaldson', position: 'Ruck', overall: 91, age: 29, value: 1150000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 11, name: 'Sam Richardson', position: 'Ruck', overall: 85, age: 24, value: 750000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },

  // Half Backs
  { id: 12, name: 'Josh Henderson', position: 'HBF', overall: 88, age: 27, value: 950000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 13, name: 'Dylan Walsh', position: 'CHB', overall: 90, age: 28, value: 1100000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 14, name: 'Luke Harrison', position: 'HBF', overall: 87, age: 25, value: 900000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },

  // Full Backs
  { id: 15, name: 'Connor McLeod', position: 'FB', overall: 91, age: 29, value: 1150000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 16, name: 'Ethan Sullivan', position: 'FB', overall: 89, age: 28, value: 1000000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },

  // Utility/Bench
  { id: 17, name: 'Noah Bennett', position: 'Utility', overall: 84, age: 22, value: 700000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false },
  { id: 18, name: 'Harry Collins', position: 'Utility', overall: 83, age: 23, value: 650000, goals: 0, behinds: 0, marks: 0, tackles: 0, matches: 0, injured: false }
])

// AFL Match state with quarters
const currentMatch = ref({
  active: false,
  paused: false,
  opponent: '',
  homeTeam: teamName.value,
  awayTeam: '',
  homeGoals: 0,
  homeBehinds: 0,
  awayGoals: 0,
  awayBehinds: 0,
  quarter: 1,
  timeInQuarter: 0,
  events: [],
  isHome: true,
  quarterBreak: false
})

// AFL Ladder (18 teams like real AFL)
const standings = ref([
  { team: teamName.value, played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Collingwood Magpies', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Brisbane Lions', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Carlton Blues', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Sydney Swans', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Port Adelaide Power', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Geelong Cats', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Richmond Tigers', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Essendon Bombers', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Fremantle Dockers', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Western Bulldogs', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Adelaide Crows', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'GWS Giants', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Hawthorn Hawks', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'St Kilda Saints', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'West Coast Eagles', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'Gold Coast Suns', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 },
  { team: 'North Melbourne', played: 0, won: 0, drawn: 0, lost: 0, pf: 0, pa: 0, percentage: 100, points: 0 }
])

// Computed properties
const sortedStandings = computed(() => {
  return [...standings.value].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.percentage !== a.percentage) return b.percentage - a.percentage
    return b.pf - a.pf
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

const homeScore = computed(() =>
  currentMatch.value.homeGoals * 6 + currentMatch.value.homeBehinds
)

const awayScore = computed(() =>
  currentMatch.value.awayGoals * 6 + currentMatch.value.awayBehinds
)

// Match simulation interval
let matchInterval = null

// Match simulation functions
const startMatch = (opponentName) => {
  if (!opponentName) {
    opponentName = availableOpponents.value[Math.floor(Math.random() * availableOpponents.value.length)]
  }

  currentMatch.value = {
    active: true,
    paused: false,
    opponent: opponentName,
    homeTeam: currentMatch.value.isHome ? teamName.value : opponentName,
    awayTeam: currentMatch.value.isHome ? opponentName : teamName.value,
    homeGoals: 0,
    homeBehinds: 0,
    awayGoals: 0,
    awayBehinds: 0,
    quarter: 1,
    timeInQuarter: 0,
    events: [],
    isHome: currentMatch.value.isHome,
    quarterBreak: false
  }

  simulateMatch()
}

const simulateMatch = () => {
  if (!currentMatch.value.active) return

  matchInterval = setInterval(() => {
    if (currentMatch.value.paused || currentMatch.value.quarterBreak) return

    currentMatch.value.timeInQuarter++

    // Each quarter is 20 minutes
    if (currentMatch.value.timeInQuarter >= 20) {
      if (currentMatch.value.quarter >= 4) {
        // Game over
        clearInterval(matchInterval)
        endMatch()
        return
      }

      // Quarter break
      currentMatch.value.quarterBreak = true
      currentMatch.value.events.unshift({
        time: `Q${currentMatch.value.quarter}`,
        type: 'quarter',
        message: `🏁 End of Quarter ${currentMatch.value.quarter} - ${currentMatch.value.homeTeam} ${homeScore.value} vs ${currentMatch.value.awayTeam} ${awayScore.value}`
      })

      setTimeout(() => {
        currentMatch.value.quarter++
        currentMatch.value.timeInQuarter = 0
        currentMatch.value.quarterBreak = false
        currentMatch.value.events.unshift({
          time: `Q${currentMatch.value.quarter}`,
          type: 'quarter',
          message: `🔔 Start of Quarter ${currentMatch.value.quarter}`
        })
      }, 2000)

      return
    }

    const eventRoll = Math.random()

    // Goal chance (roughly 2-3 per quarter per team)
    if (eventRoll > 0.94) {
      const isHomeScore = Math.random() > 0.5
      const scoringTeam = isHomeScore ? currentMatch.value.homeTeam : currentMatch.value.awayTeam
      const isGoal = Math.random() > 0.3 // 70% goals, 30% behinds

      if (scoringTeam === teamName.value) {
        // Our team scores
        const forwards = squad.value.filter(p => ['FF', 'CHF', 'HFF', 'Rover'].includes(p.position) && !p.injured)
        const scorer = forwards.length > 0 ? forwards[Math.floor(Math.random() * forwards.length)] : squad.value[0]

        if (isGoal) {
          if (isHomeScore) currentMatch.value.homeGoals++
          else currentMatch.value.awayGoals++
          scorer.goals++
          scorer.marks++

          currentMatch.value.events.unshift({
            time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
            type: 'goal',
            team: scoringTeam,
            player: scorer.name,
            message: `⚽ GOAL! ${scorer.name} slots it through! ${scoringTeam} ${isHomeScore ? homeScore.value : awayScore.value}`
          })
        } else {
          if (isHomeScore) currentMatch.value.homeBehinds++
          else currentMatch.value.awayBehinds++
          scorer.behinds++

          currentMatch.value.events.unshift({
            time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
            type: 'behind',
            team: scoringTeam,
            player: scorer.name,
            message: `📍 Behind. ${scorer.name} just misses. ${scoringTeam} ${isHomeScore ? homeScore.value : awayScore.value}`
          })
        }
      } else {
        // Opponent scores
        if (isGoal) {
          if (isHomeScore) currentMatch.value.homeGoals++
          else currentMatch.value.awayGoals++

          currentMatch.value.events.unshift({
            time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
            type: 'goal',
            team: scoringTeam,
            message: `⚽ Goal to ${scoringTeam}. ${isHomeScore ? homeScore.value : awayScore.value}`
          })
        } else {
          if (isHomeScore) currentMatch.value.homeBehinds++
          else currentMatch.value.awayBehinds++

          currentMatch.value.events.unshift({
            time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
            type: 'behind',
            team: scoringTeam,
            message: `📍 ${scoringTeam} registers a behind. ${isHomeScore ? homeScore.value : awayScore.value}`
          })
        }
      }
    }
    // Mark/tackle events (more frequent)
    else if (eventRoll > 0.88) {
      const isOurTeam = Math.random() > 0.5
      const eventType = Math.random() > 0.5 ? 'mark' : 'tackle'

      if (isOurTeam) {
        const player = squad.value.filter(p => !p.injured)[Math.floor(Math.random() * squad.value.filter(p => !p.injured).length)]

        if (eventType === 'mark') {
          player.marks++
          currentMatch.value.events.unshift({
            time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
            type: 'mark',
            player: player.name,
            message: `🙌 Strong mark by ${player.name}!`
          })
        } else {
          player.tackles++
          currentMatch.value.events.unshift({
            time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
            type: 'tackle',
            player: player.name,
            message: `💪 Crunching tackle by ${player.name}!`
          })
        }
      }
    }
    // Injury chance (rare)
    else if (eventRoll > 0.998) {
      const randomPlayer = squad.value.filter(p => !p.injured)[Math.floor(Math.random() * squad.value.filter(p => !p.injured).length)]
      if (randomPlayer) {
        randomPlayer.injured = true
        currentMatch.value.events.unshift({
          time: `Q${currentMatch.value.quarter} ${currentMatch.value.timeInQuarter}:00`,
          type: 'injury',
          player: randomPlayer.name,
          message: `🚑 ${randomPlayer.name} is down! Trainers rushing on...`
        })
      }
    }
  }, simulationSpeed.value)
}

const pauseMatch = () => {
  currentMatch.value.paused = !currentMatch.value.paused
}

const endMatch = () => {
  currentMatch.value.active = false
  if (matchInterval) clearInterval(matchInterval)

  // Update player stats
  squad.value.forEach(player => {
    if (!player.injured) {
      player.matches++
    }
  })

  // Update ladder
  const ourTeam = standings.value.find(t => t.team === teamName.value)
  const opponentTeam = standings.value.find(t => t.team === currentMatch.value.opponent)

  const ourScore = currentMatch.value.isHome ? homeScore.value : awayScore.value
  const theirScore = currentMatch.value.isHome ? awayScore.value : homeScore.value

  // Update our team
  ourTeam.played++
  ourTeam.pf += ourScore
  ourTeam.pa += theirScore

  // Update opponent
  opponentTeam.played++
  opponentTeam.pf += theirScore
  opponentTeam.pa += ourScore

  // AFL uses 4 points for win, 2 for draw, 0 for loss
  if (ourScore > theirScore) {
    ourTeam.won++
    ourTeam.points += 4
    opponentTeam.lost++
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🏆 VICTORY! Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) def. ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
    })
  } else if (ourScore < theirScore) {
    ourTeam.lost++
    opponentTeam.won++
    opponentTeam.points += 4
    currentMatch.value.events.unshift({
      type: 'result',
      message: `😞 Defeat. Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) lost to ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
    })
  } else {
    ourTeam.drawn++
    ourTeam.points += 2
    opponentTeam.drawn++
    opponentTeam.points += 2
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🤝 Draw! Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) drew with ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
    })
  }

  // Calculate percentages
  ourTeam.percentage = ourTeam.pa > 0 ? (ourTeam.pf / ourTeam.pa * 100).toFixed(2) : 100
  opponentTeam.percentage = opponentTeam.pa > 0 ? (opponentTeam.pf / opponentTeam.pa * 100).toFixed(2) : 100

  // Toggle home/away for next match
  currentMatch.value.isHome = !currentMatch.value.isHome
}

const healAllPlayers = () => {
  squad.value.forEach(player => {
    player.injured = false
  })
}

const resetSeason = () => {
  // Reset ladder
  standings.value.forEach(team => {
    team.played = 0
    team.won = 0
    team.drawn = 0
    team.lost = 0
    team.pf = 0
    team.pa = 0
    team.percentage = 100
    team.points = 0
  })

  // Reset player stats
  squad.value.forEach(player => {
    player.goals = 0
    player.behinds = 0
    player.marks = 0
    player.tackles = 0
    player.matches = 0
    player.injured = false
  })

  currentMatch.value = {
    active: false,
    paused: false,
    opponent: '',
    homeTeam: teamName.value,
    awayTeam: '',
    homeGoals: 0,
    homeBehinds: 0,
    awayGoals: 0,
    awayBehinds: 0,
    quarter: 1,
    timeInQuarter: 0,
    events: [],
    isHome: true,
    quarterBreak: false
  }
}

// Cleanup on unmount
watch(() => currentMatch.value.active, (newVal) => {
  if (!newVal && matchInterval) {
    clearInterval(matchInterval)
  }
})
</script>

<template>
  <div class="afl-manager">
    <header class="manager-header">
      <h1>🏈 {{ teamName }}</h1>
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
        @click="activeTab = 'ladder'"
        :class="{ active: activeTab === 'ladder' }">
        Ladder
      </button>
      <button
        @click="activeTab = 'stats'"
        :class="{ active: activeTab === 'stats' }">
        Statistics
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
            <span>⚽ {{ player.goals }}</span>
            <span>📍 {{ player.behinds }}</span>
            <span>🙌 {{ player.marks }}</span>
            <span>💪 {{ player.tackles }}</span>
          </div>
          <div class="player-matches">
            Matches: {{ player.matches }}
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
            <div class="score-breakdown">
              <span class="goals">{{ currentMatch.homeGoals }}.{{ currentMatch.homeBehinds }}</span>
              <span class="total-score">({{ homeScore }})</span>
            </div>
          </div>
          <div class="match-time">
            <span class="quarter">Q{{ currentMatch.quarter }}</span>
            <span class="time">{{ currentMatch.timeInQuarter }}:00</span>
            <button @click="pauseMatch" class="pause-btn">
              {{ currentMatch.paused ? '▶️' : '⏸️' }}
            </button>
          </div>
          <div class="team away">
            <h2>{{ currentMatch.awayTeam }}</h2>
            <div class="score-breakdown">
              <span class="goals">{{ currentMatch.awayGoals }}.{{ currentMatch.awayBehinds }}</span>
              <span class="total-score">({{ awayScore }})</span>
            </div>
          </div>
        </div>

        <div class="match-events">
          <h3>Match Commentary</h3>
          <div class="events-list">
            <div
              v-for="(event, index) in currentMatch.events"
              :key="index"
              class="event"
              :class="event.type">
              <span class="event-time">{{ event.time }}</span>
              <span class="event-message">{{ event.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ladder Tab -->
    <div v-if="activeTab === 'ladder'" class="tab-content">
      <div class="ladder-controls">
        <button @click="resetSeason" class="action-btn">🔄 Reset Season</button>
      </div>

      <table class="ladder-table">
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
            :class="{ 'our-team': team.team === teamName, 'finals': index < 8 }">
            <td class="position">{{ index + 1 }}</td>
            <td class="team-name">{{ team.team }}</td>
            <td>{{ team.played }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.drawn }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.pf }}</td>
            <td>{{ team.pa }}</td>
            <td>{{ team.percentage }}%</td>
            <td class="points">{{ team.points }}</td>
          </tr>
        </tbody>
      </table>
      <div class="ladder-legend">
        <span class="legend-item finals">Top 8 teams make finals</span>
      </div>
    </div>

    <!-- Statistics Tab -->
    <div v-if="activeTab === 'stats'" class="tab-content">
      <div class="stats-section">
        <h2>Leading Goalkickers</h2>
        <div v-if="topScorers.length === 0" class="empty-state">
          No goals scored yet. Play some matches!
        </div>
        <div v-else class="top-scorers">
          <div
            v-for="(player, index) in topScorers"
            :key="player.id"
            class="scorer-row">
            <span class="rank">{{ index + 1 }}</span>
            <span class="scorer-name">{{ player.name }}</span>
            <span class="scorer-position">{{ player.position }}</span>
            <span class="scorer-stats">
              <span class="goals">⚽ {{ player.goals }}</span>
              <span class="behinds">📍 {{ player.behinds }}</span>
              <span class="total">({{ player.goals * 6 + player.behinds }})</span>
            </span>
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
            <h3>${{ (squad.reduce((sum, p) => sum + p.value, 0) / 1000000).toFixed(1) }}M</h3>
            <p>Squad Value</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.afl-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.manager-header {
  background: linear-gradient(135deg, #d72317 0%, #8b1810 50%, #d72317 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  color: white;
  padding: 2.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(215, 35, 23, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  overflow: hidden;
}

.manager-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.manager-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.8rem;
  position: relative;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: 800;
  letter-spacing: -1px;
}

.header-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
}

.header-stats .stat {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-stats .stat:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tabs button {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
}

.tabs button.active {
  background: linear-gradient(135deg, #d72317 0%, #8b1810 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(215, 35, 23, 0.3);
}

.tabs button:not(.active):hover {
  background: rgba(215, 35, 23, 0.08);
  color: #d72317;
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
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.player-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #d72317, #ff6b35);
  transform: scaleX(0);
  transition: transform 0.4s;
}

.player-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 35px rgba(215, 35, 23, 0.15);
  border-color: #d72317;
}

.player-card:hover::before {
  transform: scaleX(1);
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
  background: #d72317;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.player-overall {
  background: #ffd700;
  color: #d72317;
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
.player-performance,
.player-matches {
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

.player-matches {
  font-size: 0.8rem;
  font-weight: 600;
  color: #999;
  justify-content: center;
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
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.opponent-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(215, 35, 23, 0.1), transparent);
  transition: left 0.5s;
}

.opponent-btn:hover::before {
  left: 100%;
}

.opponent-btn:hover {
  background: linear-gradient(135deg, #d72317 0%, #8b1810 100%);
  color: white;
  border-color: #d72317;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(215, 35, 23, 0.3);
}

.action-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #d72317 0%, #8b1810 50%, #d72317 100%);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(215, 35, 23, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 30px rgba(215, 35, 23, 0.4);
  background-position: 100% 0;
}

.action-btn:hover::before {
  width: 300px;
  height: 300px;
}

.action-btn:active {
  transform: translateY(-1px) scale(0.98);
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
  background: linear-gradient(135deg, #d72317 0%, #8b1810 50%, #d72317 100%);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 15px 50px rgba(215, 35, 23, 0.4);
  position: relative;
  overflow: hidden;
}

.scoreboard::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.scoreboard .team {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}

.scoreboard .team h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.score-breakdown .goals {
  font-size: 4rem;
  font-weight: 900;
  text-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4);
  animation: scoreAppear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  line-height: 1;
}

@keyframes scoreAppear {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

.score-breakdown .total-score {
  font-size: 1.8rem;
  opacity: 0.95;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.match-time {
  flex: 0 0 180px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(20px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.match-time .quarter {
  font-size: 2rem;
  font-weight: 900;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.match-time .time {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-family: 'Courier New', monospace;
}

.pause-btn {
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.pause-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.pause-btn:active {
  transform: scale(0.95);
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
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  border-left: 5px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.4s ease-out;
  transition: all 0.3s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.event:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.event.goal {
  border-left-color: #4caf50;
  background: linear-gradient(90deg, #f1f8f4 0%, white 100%);
  border-left-width: 6px;
}

.event.behind {
  border-left-color: #ff9800;
  background: linear-gradient(90deg, #fff8f1 0%, white 100%);
}

.event.mark,
.event.tackle {
  border-left-color: #2196f3;
  background: linear-gradient(90deg, #f1f8ff 0%, white 100%);
}

.event.injury {
  border-left-color: #ff6b6b;
  background: linear-gradient(90deg, #fff5f5 0%, white 100%);
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.event.quarter {
  border-left-color: #9c27b0;
  background: linear-gradient(135deg, #f8f1ff 0%, #fff 100%);
  font-weight: 700;
  font-size: 1.05rem;
  border-left-width: 6px;
}

.event.result {
  border-left-color: #ffd700;
  background: linear-gradient(135deg, #fffef5 0%, #fff 100%);
  font-weight: 700;
  font-size: 1.15rem;
  padding: 1.5rem;
  border-left-width: 8px;
  box-shadow: 0 6px 25px rgba(255, 215, 0, 0.3);
}

.event-time {
  font-weight: 700;
  color: #d72317;
  min-width: 80px;
  font-size: 0.9rem;
}

.event-message {
  flex: 1;
}

/* Ladder Table */
.ladder-controls {
  margin-bottom: 1.5rem;
}

.ladder-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.ladder-table thead {
  background: linear-gradient(135deg, #d72317 0%, #8b1810 50%, #d72317 100%);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
  color: white;
}

.ladder-table th,
.ladder-table td {
  padding: 1rem;
  text-align: left;
}

.ladder-table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.ladder-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.ladder-table tbody tr:hover {
  background: #f8f8f8;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ladder-table .our-team {
  background: linear-gradient(90deg, #fff3e0 0%, white 100%);
  font-weight: 700;
  border-left: 5px solid #ff9800;
  border-right: 5px solid #ff9800;
}

.ladder-table .our-team:hover {
  background: linear-gradient(90deg, #ffe0b2 0%, #fff3e0 100%);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
}

.ladder-table .finals {
  border-left: 5px solid #4caf50;
  background: linear-gradient(90deg, #f1f8f4 0%, white 100%);
}

.ladder-table .finals:not(.our-team) {
  font-weight: 600;
}

.ladder-table .position {
  font-weight: 700;
  color: #d72317;
}

.ladder-table .team-name {
  font-weight: 600;
}

.ladder-table .points {
  font-weight: 700;
  color: #d72317;
}

.ladder-legend {
  margin-top: 1rem;
  padding: 0.5rem;
  text-align: center;
}

.legend-item {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.legend-item.finals {
  background: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
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
  padding: 4rem 2rem;
  color: #999;
  font-style: italic;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #f9f9f9 0%, #fff 100%);
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
  animation: fadeIn 0.5s;
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
  border-color: #d72317;
  background: #fff8f7;
}

.scorer-row .rank {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d72317;
  min-width: 40px;
}

.scorer-row .scorer-name {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.scorer-row .scorer-position {
  background: #d72317;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.scorer-row .scorer-stats {
  display: flex;
  gap: 1rem;
  font-weight: 600;
}

.scorer-row .goals {
  color: #4caf50;
}

.scorer-row .behinds {
  color: #ff9800;
}

.scorer-row .total {
  color: #d72317;
  font-size: 1.1rem;
}

.squad-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.overview-stat {
  text-align: center;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #d72317 0%, #8b1810 50%, #d72317 100%);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(215, 35, 23, 0.3);
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.overview-stat::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.overview-stat:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 35px rgba(215, 35, 23, 0.4);
}

.overview-stat:hover::before {
  opacity: 1;
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

@media (max-width: 768px) {
  .manager-header h1 {
    font-size: 1.8rem;
  }

  .tabs button {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .squad-grid {
    grid-template-columns: 1fr;
  }

  .scoreboard {
    flex-direction: column;
    gap: 1rem;
  }

  .scoreboard .team h2 {
    font-size: 1.2rem;
  }

  .score-breakdown .goals {
    font-size: 2rem;
  }

  .opponent-select {
    grid-template-columns: 1fr;
  }

  .ladder-table {
    font-size: 0.85rem;
  }

  .ladder-table th,
  .ladder-table td {
    padding: 0.5rem;
  }
}
</style>
