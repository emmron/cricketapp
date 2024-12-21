<script setup>
import { ref, computed } from 'vue'

// Team and Match Details
const battingTeam = ref('')
const bowlingTeam = ref('')
const targetScore = ref(null)

// Main Score
const score = ref(0)
const wickets = ref(0)
const overs = ref(0)
const balls = ref(0)

// Extras
const wides = ref(0)
const noBalls = ref(0)
const byes = ref(0)
const legByes = ref(0)

// Current Batsmen
const batsmen = ref([
  { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true },
  { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false }
])

// Current Bowler
const currentBowler = ref({
  name: '',
  overs: 0,
  balls: 0,
  runs: 0,
  wickets: 0,
  maidens: 0,
  runsInOver: 0
})

// Add new state variables
const showInitModal = ref(true)
const showWicketModal = ref(false)
const showBowlerModal = ref(false)
const wicketTypes = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Other']
const selectedWicketType = ref('Bowled')

// Add match settings
const matchSettings = ref({
  maxOvers: 20,
  maxWickets: 10,
  powerPlayOvers: 6
})

// Add match metadata
const matchInfo = ref({
  venue: '',
  date: new Date().toISOString().split('T')[0],
  matchType: 'T20',
  maxOvers: 20
})

// Add history tracking
const history = ref([])
const matchHistory = ref([])

// Computed properties
const runRate = computed(() => {
  const totalOvers = overs.value + (balls.value / 6)
  return totalOvers > 0 ? (score.value / totalOvers).toFixed(2) : '0.00'
})

const extras = computed(() => 
  wides.value + noBalls.value + byes.value + legByes.value
)

const requiredRuns = computed(() => {
  if (!targetScore.value) return null
  return targetScore.value - score.value
})

const requiredRunRate = computed(() => {
  if (!targetScore.value) return null
  const remainingRuns = targetScore.value - score.value
  const remainingOvers = matchSettings.value.maxOvers - (overs.value + balls.value/6)
  return remainingOvers > 0 ? (remainingRuns / remainingOvers).toFixed(2) : 'N/A'
})

// State management
const saveState = () => {
  history.value.push({
    score: score.value,
    wickets: wickets.value,
    overs: overs.value,
    balls: balls.value,
    batsmen: JSON.parse(JSON.stringify(batsmen.value)),
    currentBowler: JSON.parse(JSON.stringify(currentBowler.value)),
    extras: {
      wides: wides.value,
      noBalls: noBalls.value,
      byes: byes.value,
      legByes: legByes.value
    }
  })
}

const undo = () => {
  const previousState = history.value.pop()
  if (previousState) {
    score.value = previousState.score
    wickets.value = previousState.wickets
    overs.value = previousState.overs
    balls.value = previousState.balls
    batsmen.value = previousState.batsmen
    currentBowler.value = previousState.currentBowler
    wides.value = previousState.extras.wides
    noBalls.value = previousState.extras.noBalls
    byes.value = previousState.extras.byes
    legByes.value = previousState.extras.legByes
  }
}

// Game actions
const addRuns = (runs, isExtra = false) => {
  saveState()
  score.value += runs
  if (!isExtra) {
    const striker = batsmen.value.find(b => b.onStrike)
    if (striker) {
      striker.runs += runs
      striker.balls++
      if (runs === 4) striker.fours++
      if (runs === 6) striker.sixes++
    }
    currentBowler.value.runs += runs
    currentBowler.value.runsInOver += runs
  }
}

const addExtra = (type) => {
  saveState()
  switch(type) {
    case 'wide':
      wides.value++
      score.value++
      currentBowler.value.runs++
      currentBowler.value.runsInOver++
      break
    case 'no-ball':
      noBalls.value++
      score.value++
      currentBowler.value.runs++
      currentBowler.value.runsInOver++
      break
    case 'bye':
    case 'leg-bye':
      const runs = parseInt(prompt('How many runs?') || '0')
      if (type === 'bye') byes.value += runs
      else legByes.value += runs
      score.value += runs
      addBall()
      break
  }
}

const addWicket = () => {
  saveState()
  if (wickets.value < matchSettings.value.maxWickets) {
    showWicketModal.value = true
  }
}

const confirmWicket = (outBatsman, newBatsman) => {
  if (wickets.value < matchSettings.value.maxWickets) {
    wickets.value++
    currentBowler.value.wickets++
    
    const striker = batsmen.value.find(b => b.onStrike)
    if (striker) {
      striker.balls++
      striker.name = newBatsman
      striker.runs = 0
      striker.balls = 0
      striker.fours = 0
      striker.sixes = 0
    }
    addBall()
  }
  showWicketModal.value = false
}
const switchStriker = () => {
  if (batsmen.value.length === 2) {
    batsmen.value = batsmen.value.map(batsman => ({
      ...batsman,
      onStrike: !batsman.onStrike
    }));
  } else {
    console.error('There should be exactly 2 batsmen to switch strike.');
  }
}

const initializeInnings = () => {
  const elements = ['battingTeam', 'bowlingTeam', 'targetScore', 'maxOvers', 'striker', 'nonStriker'];
  const values = elements.map(id => document.getElementById(id)?.value || '');

  [battingTeam.value, bowlingTeam.value] = values.slice(0, 2);

  const target = values[2];
  targetScore.value = target ? parseInt(target) : null;

  const maxOvers = values[3];
  matchSettings.value.maxOvers = maxOvers ? parseInt(maxOvers) : matchSettings.value.maxOvers;

  [batsmen.value[0].name, batsmen.value[1].name] = values.slice(4, 6);

  showInitModal.value = false;
}

const addBall = () => {
  if (!currentBowler.value.name) {
    const name = prompt('Enter bowler name:')
    if (name) currentBowler.value.name = name
  }
  
  balls.value++
  currentBowler.value.balls++
  
  if (balls.value === 6) {
    overs.value++
    balls.value = 0
    if (currentBowler.value.runsInOver === 0) {
      currentBowler.value.maidens++
    }
    currentBowler.value.overs++
    currentBowler.value.balls = 0
    currentBowler.value.runsInOver = 0
    switchStriker()
  }
}

// Export functionality
const exportToCSV = () => {
  const matchData = {
    matchInfo: {
      date: matchInfo.value.date,
      venue: matchInfo.value.venue,
      type: matchInfo.value.matchType,
      teams: `${battingTeam.value} vs ${bowlingTeam.value}`,
      result: `${score.value}/${wickets.value} (${overs.value}.${balls.value})`,
      target: targetScore.value ? `Target: ${targetScore.value}` : 'First Innings',
      maxOvers: matchSettings.value.maxOvers
    },
    batting: {
      team: battingTeam.value,
      score: score.value,
      wickets: wickets.value,
      overs: `${overs.value}.${balls.value}`,
      runRate: runRate.value,
      requiredRate: targetScore.value ? requiredRunRate.value : 'N/A',
      extras: {
        total: extras.value,
        wides: wides.value,
        noBalls: noBalls.value,
        byes: byes.value,
        legByes: legByes.value
      }
    },
    batsmen: batsmen.value.map(b => ({
      name: b.name,
      runs: b.runs,
      balls: b.balls,
      fours: b.fours,
      sixes: b.sixes,
      strikeRate: b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0',
      status: b.onStrike ? 'Not Out*' : 'Not Out'
    })),
    bowler: {
      name: currentBowler.value.name,
      overs: `${currentBowler.value.overs}.${currentBowler.value.balls}`,
      maidens: currentBowler.value.maidens,
      runs: currentBowler.value.runs,
      wickets: currentBowler.value.wickets,
      economy: currentBowler.value.overs > 0 ? 
        (currentBowler.value.runs / currentBowler.value.overs).toFixed(1) : '0.0',
      dotBalls: currentBowler.value.balls - currentBowler.value.runsInOver
    }
  }

  // Convert to CSV with sections
  const csvContent = [
    ['Match Summary'],
    ['Date', matchData.matchInfo.date],
    ['Venue', matchData.matchInfo.venue],
    ['Match Type', matchData.matchInfo.type],
    ['Teams', matchData.matchInfo.teams],
    ['Max Overs', matchData.matchInfo.maxOvers],
    ['Target', matchData.matchInfo.target],
    ['Current Score', matchData.matchInfo.result],
    [''],
    ['Batting Summary'],
    ['Team', matchData.batting.team],
    ['Score', `${matchData.batting.score}/${matchData.batting.wickets}`],
    ['Overs', matchData.batting.overs],
    ['Run Rate', matchData.batting.runRate],
    ['Required Rate', matchData.batting.requiredRate],
    [''],
    ['Extras Breakdown'],
    ['Total Extras', matchData.batting.extras.total],
    ['Wides', matchData.batting.extras.wides],
    ['No Balls', matchData.batting.extras.noBalls],
    ['Byes', matchData.batting.extras.byes],
    ['Leg Byes', matchData.batting.extras.legByes],
    [''],
    ['Batting Details'],
    ['Name', 'Runs', 'Balls', '4s', '6s', 'SR', 'Status'],
    ...matchData.batsmen.map(b => [
      b.name, b.runs, b.balls, b.fours, b.sixes, b.strikeRate, b.status
    ]),
    [''],
    ['Current Bowler Analysis'],
    ['Name', 'Overs', 'Maidens', 'Runs', 'Wickets', 'Economy', 'Dot Balls'],
    [
      matchData.bowler.name,
      matchData.bowler.overs,
      matchData.bowler.maidens,
      matchData.bowler.runs,
      matchData.bowler.wickets,
      matchData.bowler.economy,
      matchData.bowler.dotBalls
    ],
    [''],
    ['Match Progress'],
    ['Over', 'Runs', 'Wickets', 'Run Rate'],
    ...history.value.map((h, i) => [
      `${h.overs}.${h.balls}`,
      h.score,
      h.wickets,
      (h.score / (h.overs + h.balls/6)).toFixed(2)
    ])
  ].map(row => row.join(',')).join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  link.download = `cricket_score_${matchData.matchInfo.date}_${matchData.batting.team}_${timestamp}.csv`
  link.click()
}
</script>

<template>
  <div class="cricket-scorer">
    <!-- Initialize Match Modal -->
    <div v-if="showInitModal" class="modal">
      <div class="modal-content">
        <h2 class="modal-title">New Match</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Batting Team</label>
            <input id="battingTeam" type="text" placeholder="Enter batting team">
          </div>
          
          <div class="form-group">
            <label>Bowling Team</label>
            <input id="bowlingTeam" type="text" placeholder="Enter bowling team">
          </div>
          
          <div class="form-group">
            <label>Match Type</label>
            <select v-model="matchInfo.matchType">
              <option value="T20">T20</option>
              <option value="ODI">ODI</option>
              <option value="Test">Test</option>
            </select>
          </div>

          <div class="form-group">
            <label>Overs</label>
            <input id="maxOvers" type="number" v-model="matchSettings.maxOvers">
          </div>
          
          <div class="form-group">
            <label>Venue</label>
            <input v-model="matchInfo.venue" type="text" placeholder="Enter venue name">
          </div>

          <div class="form-group">
            <label>Date</label>
            <input v-model="matchInfo.date" type="date">
          </div>
          
          <div class="form-group span-2">
            <label>Target Score (if 2nd innings)</label>
            <input id="targetScore" type="number" placeholder="Optional">
          </div>
          
          <div class="form-group">
            <label>Striker</label>
            <input id="striker" type="text" placeholder="Enter striker's name">
          </div>
          
          <div class="form-group">
            <label>Non-striker</label>
            <input id="nonStriker" type="text" placeholder="Enter non-striker's name">
          </div>
        </div>
        <button @click="initializeInnings" class="primary">Start Match</button>
      </div>
    </div>

    <!-- Wicket Modal -->
    <div v-if="showWicketModal" class="modal">
      <div class="modal-content">
        <h2>Wicket Details</h2>
        <div class="form-group">
          <label>Type of Dismissal</label>
          <select v-model="selectedWicketType">
            <option v-for="type in wicketTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          
          <label>New Batsman</label>
          <input id="newBatsman" type="text" placeholder="Enter new batsman's name">
        </div>
        <div class="modal-buttons">
          <button @click="showWicketModal = false" class="secondary">Cancel</button>
          <button @click="confirmWicket(selectedWicketType, 
                         document.getElementById('newBatsman').value)" 
                  class="primary">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="quick-actions">
      <button @click="undo" class="secondary" :disabled="!history.length">
        <span class="icon">↩</span> Undo
      </button>
      <button @click="exportToCSV" class="secondary">
        <span class="icon">⬇</span> Export
      </button>
      <button @click="switchStriker" class="secondary">
        <span class="icon">⇄</span> Switch Strike
      </button>
    </div>

    <!-- Main Score Display -->
    <div class="score-card">
      <div class="main-score">
        <h2>{{ score }}/{{ wickets }}</h2>
        <div class="overs">{{ overs }}.{{ balls }} ov</div>
      </div>
      <div class="run-rates">
        <div>CRR: {{ runRate }}</div>
        <div v-if="targetScore">RRR: {{ requiredRunRate }}</div>
      </div>
    </div>

    <!-- Target Info -->
    <div v-if="targetScore" class="chase-info">
      Target: {{ targetScore }} ({{ requiredRuns }} needed from {{ matchSettings.maxOvers - overs - (balls/6) }} overs)
    </div>

    <!-- Scoring Controls -->
    <div class="scoring-controls">
      <!-- Runs Buttons -->
      <div class="runs-grid">
        <button 
          v-for="runs in [0,1,2,3,4,6]" 
          :key="runs"
          @click="addRuns(runs)"
          :class="['run-button', {'highlight': runs === 4 || runs === 6}]"
        >
          {{ runs }}{{ runs === 0 ? ' (dot)' : '' }}
        </button>
      </div>

      <!-- Extras Buttons -->
      <div class="extras-grid">
        <button @click="addExtra('wide')" class="extra-button">Wide</button>
        <button @click="addExtra('no-ball')" class="extra-button">No Ball</button>
        <button @click="addExtra('bye')" class="extra-button">Bye</button>
        <button @click="addExtra('leg-bye')" class="extra-button">Leg Bye</button>
      </div>

      <!-- Wicket Button -->
      <button @click="addWicket" class="wicket-button">
        <span class="icon">✖</span> Wicket
      </button>
    </div>

    <!-- Current Partnership -->
    <div class="partnership-info">
      <h3>Current Partnership</h3>
      <div class="partnership-details">
        {{ currentPartnershipRuns }} runs from {{ currentPartnershipBalls }} balls
      </div>
    </div>
  </div>
</template>

<style scoped>
.cricket-scorer {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  background: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.init-button {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.init-button:hover {
  background: #0056b3;
}

.scoreboard {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.team-info {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
}

.main-score {
  text-align: center;
  margin-bottom: 1.5rem;
}

.main-score h2 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #28a745;
}

.batsmen {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #e9f5e9;
  border-radius: 8px;
}

.batsmen .on-strike::before {
  content: "* ";
  color: #28a745;
}

.bowler {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #e9f5e9;
  border-radius: 8px;
}

.controls {
  display: grid;
  gap: 1.5rem;
}

.runs-buttons, .extra-buttons, .wicket-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

button {
  padding: 1.2rem;
  font-size: 1.4rem;
  border: 1px solid #e9ecef;
  background: #ffffff;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

button:hover {
  background: #f1f1f1;
  transform: translateY(-2px);
}

.wicket {
  background: #dc3545;
  color: white;
}

.wide, .no-ball, .bye, .leg-bye {
  background: #ffc107;
  color: white;
}

.switch {
  background: #28a745;
  color: white;
}

.extras {
  font-size: 1rem;
  color: #6c757d;
  text-align: center;
  margin-top: 1.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: grid;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  padding: 0.8rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.2rem;
}

.modal-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  background: #ffffff;
  padding: 1rem;
  z-index: 100;
  border-bottom: 2px solid #e9ecef;
}

.primary {
  background: #007bff;
  color: white;
}

.secondary {
  background: #f1f1f1;
}

.chase-info {
  background: #e9f5e9;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

/* Make buttons more touch-friendly on mobile */
@media (max-width: 768px) {
  button {
    padding: 1.2rem;
    font-size: 1.1rem;
  }
  
  .runs-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* New and updated styles */
.match-header {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.venue-info {
  color: #6c757d;
  font-size: 1rem;
  margin: 0.5rem 0;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  justify-content: center;
}

.score-display h2 {
  font-size: 3rem;
  font-weight: 600;
  color: #28a745;
}

.rate-info {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.match-details {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.batsmen-card, .bowler-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.batsmen-table {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.table-header, .batsman-row {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  align-items: center;
  padding: 0.5rem;
}

.table-header {
  font-weight: bold;
  color: #6c757d;
  font-size: 1rem;
}

.batsman-row {
  border-radius: 4px;
}

.batsman-row.on-strike {
  background: #e9f5e9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.span-2 {
  grid-column: span 2;
}

.modal-title {
  color: #333;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .span-2 {
    grid-column: auto;
  }
  
  .table-header, .batsman-row {
    grid-template-columns: 2fr repeat(3, 1fr);
  }
  
  .table-header span:nth-child(n+5), 
  .batsman-row span:nth-child(n+5) {
    display: none;
  }
}

.score-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.main-score {
  font-size: 2.5rem;
  font-weight: bold;
}

.overs {
  font-size: 1.2rem;
  color: #6c757d;
}

.scoring-controls {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.runs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.run-button {
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.run-button.highlight {
  background: #28a745;
  color: white;
}

.extras-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.extra-button {
  padding: 0.8rem;
  background: #e9f5e9;
}

.wicket-button {
  background: #dc3545;
  color: white;
  padding: 1rem;
  font-weight: bold;
}

.partnership-info {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.icon {
  font-size: 1.2em;
  margin-right: 0.3rem;
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .runs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .run-button {
    padding: 1.5rem;
    font-size: 1.5rem;
  }

  .extra-button {
    padding: 1.2rem;
    font-size: 1.1rem;
  }

  .quick-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    padding: 0.8rem;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
  }

  .cricket-scorer {
    padding-bottom: 5rem;
  }
}
</style> 