<script setup>
import { ref, computed } from 'vue'

// Game state
const activeTab = ref('squad')
const simulationSpeed = ref(500)

// Team data
const teamName = ref('FC Manager')
const budget = ref(50000000)
const reputation = ref(50)

// Squad with realistic player stats
const squad = ref([
  // Goalkeepers
  { id: 1, name: 'David Martinez', position: 'GK', overall: 82, age: 28, value: 15000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 2, name: 'Lucas Weber', position: 'GK', overall: 75, age: 24, value: 5000000, goals: 0, assists: 0, matches: 0, injured: false },

  // Defenders
  { id: 3, name: 'Alessandro Rossi', position: 'CB', overall: 85, age: 26, value: 35000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 4, name: 'John Smith', position: 'CB', overall: 83, age: 29, value: 25000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 5, name: 'Pierre Dubois', position: 'LB', overall: 81, age: 25, value: 20000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 6, name: 'Miguel Santos', position: 'RB', overall: 80, age: 27, value: 18000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 7, name: 'Ivan Petrov', position: 'CB', overall: 79, age: 30, value: 12000000, goals: 0, assists: 0, matches: 0, injured: false },

  // Midfielders
  { id: 8, name: 'Kevin Anderson', position: 'CDM', overall: 84, age: 27, value: 30000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 9, name: 'Marco Bianchi', position: 'CM', overall: 86, age: 24, value: 40000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 10, name: 'Carlos Fernandez', position: 'CAM', overall: 88, age: 25, value: 55000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 11, name: 'Thomas Mueller', position: 'CM', overall: 82, age: 28, value: 28000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 12, name: 'Andre Silva', position: 'RM', overall: 81, age: 23, value: 22000000, goals: 0, assists: 0, matches: 0, injured: false },

  // Forwards
  { id: 13, name: 'Luca Romano', position: 'ST', overall: 89, age: 26, value: 65000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 14, name: 'Mohamed Hassan', position: 'LW', overall: 87, age: 23, value: 50000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 15, name: 'James Wilson', position: 'RW', overall: 85, age: 24, value: 42000000, goals: 0, assists: 0, matches: 0, injured: false },
  { id: 16, name: 'Diego Lopez', position: 'ST', overall: 83, age: 29, value: 32000000, goals: 0, assists: 0, matches: 0, injured: false }
])

// Match state
const currentMatch = ref({
  active: false,
  opponent: '',
  homeTeam: teamName.value,
  awayTeam: '',
  homeScore: 0,
  awayScore: 0,
  minute: 0,
  events: [],
  isHome: true
})

// League standings
const standings = ref([
  { team: teamName.value, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Real Champions', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Barcelona United', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Bayern City', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Paris FC', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Liverpool Athletic', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Manchester Rovers', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  { team: 'Chelsea Galaxy', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }
])

// Computed properties
const sortedStandings = computed(() => {
  return [...standings.value].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    return b.gf - a.gf
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
    homeScore: 0,
    awayScore: 0,
    minute: 0,
    events: [],
    isHome: currentMatch.value.isHome
  }

  simulateMatch()
}

const simulateMatch = () => {
  if (!currentMatch.value.active) return

  const interval = setInterval(() => {
    if (currentMatch.value.minute >= 90) {
      clearInterval(interval)
      endMatch()
      return
    }

    currentMatch.value.minute++

    // Random events during match
    const eventChance = Math.random()

    // Goal chance (approximately 1 every 30 minutes on average)
    if (eventChance > 0.97) {
      const isHomeGoal = Math.random() > 0.5
      const scoringTeam = isHomeGoal ? currentMatch.value.homeTeam : currentMatch.value.awayTeam

      if (scoringTeam === teamName.value) {
        // Our team scores
        const attackers = squad.value.filter(p => ['ST', 'LW', 'RW', 'CAM'].includes(p.position))
        const scorer = attackers[Math.floor(Math.random() * attackers.length)]

        if (isHomeGoal) {
          currentMatch.value.homeScore++
        } else {
          currentMatch.value.awayScore++
        }

        scorer.goals++

        currentMatch.value.events.unshift({
          minute: currentMatch.value.minute,
          type: 'goal',
          team: scoringTeam,
          player: scorer.name,
          message: `⚽ GOAL! ${scorer.name} scores for ${scoringTeam}!`
        })
      } else {
        // Opponent scores
        if (isHomeGoal) {
          currentMatch.value.homeScore++
        } else {
          currentMatch.value.awayScore++
        }

        currentMatch.value.events.unshift({
          minute: currentMatch.value.minute,
          type: 'goal',
          team: scoringTeam,
          message: `⚽ Goal for ${scoringTeam}...`
        })
      }
    }

    // Injury chance (rare)
    if (eventChance > 0.995) {
      const randomPlayer = squad.value[Math.floor(Math.random() * squad.value.length)]
      randomPlayer.injured = true
      currentMatch.value.events.unshift({
        minute: currentMatch.value.minute,
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

  // Update standings
  const ourTeam = standings.value.find(t => t.team === teamName.value)
  const opponentTeam = standings.value.find(t => t.team === currentMatch.value.opponent)

  const ourScore = currentMatch.value.isHome ? currentMatch.value.homeScore : currentMatch.value.awayScore
  const theirScore = currentMatch.value.isHome ? currentMatch.value.awayScore : currentMatch.value.homeScore

  // Update our team
  ourTeam.played++
  ourTeam.gf += ourScore
  ourTeam.ga += theirScore
  ourTeam.gd = ourTeam.gf - ourTeam.ga

  // Update opponent
  opponentTeam.played++
  opponentTeam.gf += theirScore
  opponentTeam.ga += ourScore
  opponentTeam.gd = opponentTeam.gf - opponentTeam.ga

  if (ourScore > theirScore) {
    ourTeam.won++
    ourTeam.points += 3
    opponentTeam.lost++
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🏆 Victory! Final score: ${currentMatch.value.homeScore} - ${currentMatch.value.awayScore}`
    })
  } else if (ourScore < theirScore) {
    ourTeam.lost++
    opponentTeam.won++
    opponentTeam.points += 3
    currentMatch.value.events.unshift({
      type: 'result',
      message: `😞 Defeat. Final score: ${currentMatch.value.homeScore} - ${currentMatch.value.awayScore}`
    })
  } else {
    ourTeam.drawn++
    ourTeam.points++
    opponentTeam.drawn++
    opponentTeam.points++
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🤝 Draw. Final score: ${currentMatch.value.homeScore} - ${currentMatch.value.awayScore}`
    })
  }

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
    team.gf = 0
    team.ga = 0
    team.gd = 0
    team.points = 0
  })

  // Reset player stats
  squad.value.forEach(player => {
    player.goals = 0
    player.assists = 0
    player.matches = 0
    player.injured = false
  })

  currentMatch.value = {
    active: false,
    opponent: '',
    homeTeam: teamName.value,
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    minute: 0,
    events: [],
    isHome: true
  }
}
</script>

<template>
  <div class="football-manager">
    <header class="manager-header">
      <h1>⚽ {{ teamName }}</h1>
      <div class="header-stats">
        <span class="stat">Overall: {{ teamOverall }}</span>
        <span class="stat">Budget: €{{ (budget / 1000000).toFixed(1) }}M</span>
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
            <span>Value: €{{ (player.value / 1000000).toFixed(1) }}M</span>
          </div>
          <div class="player-performance">
            <span>⚽ {{ player.goals }}</span>
            <span>🎯 {{ player.assists }}</span>
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
            <span class="score">{{ currentMatch.homeScore }}</span>
          </div>
          <div class="match-time">
            <span class="minute">{{ currentMatch.minute }}'</span>
          </div>
          <div class="team away">
            <h2>{{ currentMatch.awayTeam }}</h2>
            <span class="score">{{ currentMatch.awayScore }}</span>
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
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
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
            <td>{{ team.gf }}</td>
            <td>{{ team.ga }}</td>
            <td :class="{ positive: team.gd > 0, negative: team.gd < 0 }">
              {{ team.gd > 0 ? '+' : '' }}{{ team.gd }}
            </td>
            <td class="points">{{ team.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Statistics Tab -->
    <div v-if="activeTab === 'stats'" class="tab-content">
      <div class="stats-section">
        <h2>Top Scorers</h2>
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
            <span class="scorer-goals">⚽ {{ player.goals }}</span>
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
            <h3>€{{ (squad.reduce((sum, p) => sum + p.value, 0) / 1000000).toFixed(0) }}M</h3>
            <p>Squad Value</p>
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

.scoreboard .score {
  font-size: 3rem;
  font-weight: 700;
}

.match-time {
  flex: 0 0 120px;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 8px;
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

  .scoreboard .score {
    font-size: 2rem;
  }
}
</style>
