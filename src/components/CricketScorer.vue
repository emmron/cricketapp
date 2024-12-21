<script setup>
import { ref, computed } from 'vue'

// Core game state
const score = ref(0)
const wickets = ref(0)
const overs = ref(0)
const balls = ref(0)
const extras = {
  wides: ref(0),
  noBalls: ref(0), 
  byes: ref(0),
  legByes: ref(0)
}
const history = ref([])

// Player state
const batsmen = ref([
  { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true },
  { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false }
])

const currentBowler = ref({
  name: '',
  overs: 0,
  balls: 0,
  runs: 0,
  wickets: 0,
  maidens: 0,
  runsInOver: 0
})

// Match settings
const settings = ref({
  maxOvers: 20,
  maxWickets: 10,
  powerPlayOvers: 6
})

const matchInfo = ref({
  battingTeam: '',
  bowlingTeam: '',
  venue: '',
  date: new Date().toISOString().split('T')[0],
  matchType: 'T20',
  targetScore: null
})

// UI state
const showInitModal = ref(true)
const showWicketModal = ref(false)
const wicketTypes = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Other']
const selectedWicketType = ref('Bowled')

// Modal state
const showExtraRunsModal = ref(false)
const showNewBowlerModal = ref(false)
const extraRunsType = ref('')
const extraRunsAmount = ref(0)
const newBowlerName = ref('')

// Form state
const initForm = ref({
  battingTeam: '',
  bowlingTeam: '',
  targetScore: '',
  maxOvers: 20,
  striker: '',
  nonStriker: '',
  venue: '',
  matchType: 'T20'
})

// Computed stats with improved precision
const runRate = computed(() => {
  const totalOvers = overs.value + (balls.value / 6)
  return totalOvers > 0 ? Number((score.value / totalOvers).toFixed(2)) : 0
})

const totalExtras = computed(() => {
  return extras.wides.value + extras.noBalls.value + extras.byes.value + extras.legByes.value
})

const requiredRuns = computed(() => {
  if (!matchInfo.value.targetScore) return null
  const remainingRuns = matchInfo.value.targetScore - score.value
  return Math.max(remainingRuns, 0)
})

const requiredRunRate = computed(() => {
  if (!matchInfo.value.targetScore) return null
  const remainingRuns = requiredRuns.value
  const remainingBalls = (settings.value.maxOvers * 6) - (overs.value * 6 + balls.value)
  const remainingOvers = remainingBalls / 6

  if (remainingOvers <= 0 || remainingRuns <= 0) return 0
  return Number((remainingRuns / remainingOvers).toFixed(2))
})

// Game actions with improved validation
const saveState = () => {
  const currentState = {
    score: score.value,
    wickets: wickets.value,
    overs: overs.value,
    balls: balls.value,
    extras: {
      wides: extras.wides.value,
      noBalls: extras.noBalls.value,
      byes: extras.byes.value,
      legByes: extras.legByes.value
    },
    batsmen: JSON.parse(JSON.stringify(batsmen.value)),
    currentBowler: currentBowler.value ? { ...currentBowler.value } : null
  }
  history.value.push(currentState)
}

const undo = () => {
  if (history.value.length === 0) return
  
  const previousState = history.value.pop()
  if (previousState) {
    score.value = previousState.score
    wickets.value = previousState.wickets
    overs.value = previousState.overs
    balls.value = previousState.balls
    extras.wides.value = previousState.extras.wides
    extras.noBalls.value = previousState.extras.noBalls
    extras.byes.value = previousState.extras.byes
    extras.legByes.value = previousState.extras.legByes
    batsmen.value = previousState.batsmen
    if (previousState.currentBowler) {
      currentBowler.value = previousState.currentBowler
    }
  }
}

const switchStriker = () => {
  batsmen.value = batsmen.value.map(batsman => ({
    ...batsman,
    onStrike: !batsman.onStrike
  }))
}

const updateBatsmanScore = (runs) => {
  const striker = batsmen.value.find(b => b.onStrike)
  if (!striker) return

  striker.runs += runs
  striker.balls++
  if (runs === 4) striker.fours++
  if (runs === 6) striker.sixes++
}

const updateBowlerStats = (runs, isExtra = false) => {
  if (!currentBowler.value.name) return
  
  if (!isExtra) {
    currentBowler.value.runs += runs
    currentBowler.value.runsInOver += runs
  }
}

const addRuns = (runs, isExtra = false) => {
  if (runs < 0 || runs > 6) return
  if (runs === 5) return // Invalid cricket score
  
  saveState()
  score.value += runs
  
  if (!isExtra) {
    updateBatsmanScore(runs)
    updateBowlerStats(runs)
    addBall()
  }
  
  // Auto switch strike for odd runs
  if (runs % 2 === 1) {
    switchStriker()
  }
}

const addExtra = (type) => {
  if (!type) return
  
  saveState()
  
  switch(type) {
    case 'wide':
      extras.wides.value++
      score.value++
      updateBowlerStats(1, true)
      break
    case 'no-ball':
      extras.noBalls.value++
      score.value++
      updateBowlerStats(1, true)
      break
    case 'bye':
    case 'leg-bye':
      extraRunsType.value = type
      showExtraRunsModal.value = true
      break
  }
}

const confirmExtraRuns = () => {
  const runs = parseInt(extraRunsAmount.value)
  if (isNaN(runs) || runs < 0) return
  
  if (extraRunsType.value === 'bye') {
    extras.byes.value += runs
  } else {
    extras.legByes.value += runs
  }
  score.value += runs
  addBall()
  showExtraRunsModal.value = false
  extraRunsAmount.value = 0
}

const addBall = () => {
  if (!currentBowler.value.name) {
    showNewBowlerModal.value = true
    return
  }
  updateBallCount()
}

const confirmNewBowler = () => {
  if (!newBowlerName.value.trim()) return
  
  currentBowler.value.name = newBowlerName.value.trim()
  updateBallCount()
  showNewBowlerModal.value = false
  newBowlerName.value = ''
}

const updateBallCount = () => {
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

const addWicket = () => {
  if (wickets.value >= settings.value.maxWickets) return
  
  saveState()
  showWicketModal.value = true
}

const confirmWicket = (outBatsman, newBatsman) => {
  if (!newBatsman || wickets.value >= settings.value.maxWickets) return
  
  wickets.value++
  currentBowler.value.wickets++
  
  const striker = batsmen.value.find(b => b.onStrike)
  if (striker) {
    striker.balls++
    striker.name = newBatsman.trim()
    striker.runs = 0
    striker.balls = 0
    striker.fours = 0
    striker.sixes = 0
  }
  
  addBall()
  showWicketModal.value = false
}

const initializeInnings = () => {
  // Validate required fields
  if (!initForm.value.battingTeam?.trim() || 
      !initForm.value.bowlingTeam?.trim() || 
      !initForm.value.striker?.trim() || 
      !initForm.value.nonStriker?.trim()) {
    alert('Please fill in all required fields')
    return
  }

  try {
    // Update match info
    matchInfo.value = {
      battingTeam: initForm.value.battingTeam.trim(),
      bowlingTeam: initForm.value.bowlingTeam.trim(),
      venue: initForm.value.venue?.trim() || '',
      date: new Date().toISOString().split('T')[0],
      matchType: initForm.value.matchType,
      targetScore: initForm.value.targetScore ? parseInt(initForm.value.targetScore) : null
    }

    // Update settings
    settings.value = {
      ...settings.value,
      maxOvers: Math.max(1, parseInt(initForm.value.maxOvers) || 20)
    }

    // Initialize batsmen
    batsmen.value = [
      { 
        name: initForm.value.striker.trim(), 
        runs: 0, 
        balls: 0, 
        fours: 0, 
        sixes: 0, 
        onStrike: true 
      },
      { 
        name: initForm.value.nonStriker.trim(), 
        runs: 0, 
        balls: 0, 
        fours: 0, 
        sixes: 0, 
        onStrike: false 
      }
    ]

    // Reset game state
    score.value = 0
    wickets.value = 0
    overs.value = 0
    balls.value = 0
    extras.wides.value = 0
    extras.noBalls.value = 0
    extras.byes.value = 0
    extras.legByes.value = 0
    history.value = []

    // Reset current bowler
    currentBowler.value = {
      name: '',
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      maidens: 0,
      runsInOver: 0
    }

    showInitModal.value = false
  } catch (error) {
    console.error('Error initializing innings:', error)
    alert('There was an error starting the match. Please try again.')
  }
}
</script>

<template>
  <!-- Initial Match Setup Modal -->
  <div v-if="showInitModal" class="modal-overlay" style="background: rgba(0,0,0,0.8)">
    <div class="modal-card" style="background: #1a1a1a; color: #fff">
      <h2 class="modal-title">New Match</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>Batting Team *</label>
          <input 
            v-model="initForm.battingTeam" 
            type="text" 
            required
            style="background: #333; color: #fff; border: 1px solid #666; padding: 8px"
            placeholder="Enter batting team name"
          >
        </div>
        <div class="form-group">
          <label>Bowling Team *</label>
          <input 
            v-model="initForm.bowlingTeam" 
            type="text" 
            required
            style="background: #333; color: #fff; border: 1px solid #666; padding: 8px"
            placeholder="Enter bowling team name"
          >
        </div>
        <div class="form-group">
          <label>Striker *</label>
          <input 
            v-model="initForm.striker" 
            type="text" 
            required
            style="background: #333; color: #fff; border: 1px solid #666; padding: 8px"
            placeholder="Enter striker's name"
          >
        </div>
        <div class="form-group">
          <label>Non-striker *</label>
          <input 
            v-model="initForm.nonStriker" 
            type="text" 
            required
            style="background: #333; color: #fff; border: 1px solid #666; padding: 8px"
            placeholder="Enter non-striker's name"
          >
        </div>
      </div>
      <button 
        @click="initializeInnings" 
        style="background: #2563eb; color: #fff; padding: 10px 20px; border: none; border-radius: 4px"
      >
        Start Match
      </button>
    </div>
  </div>

  <!-- Main Scoring Interface -->
  <div v-else class="scorer-container" style="background: #1a1a1a; color: #fff">
    <!-- Score Display -->
    <div class="score-board" style="background: linear-gradient(135deg, #1e40af, #1d4ed8); color: #fff">
      <h2 class="team-name">{{ matchInfo.battingTeam }}</h2>
      <div class="score-display">
        <div class="main-score">
          <span class="score-value">{{ score }}/{{ wickets }}</span>
          <span class="overs-value">({{ overs }}.{{ balls }})</span>
        </div>
      </div>
      <div class="run-rates">
        <div class="rate-item">
          <span>CRR:</span>
          <span class="rate-value">{{ runRate }}</span>
        </div>
        <div v-if="matchInfo.targetScore" class="rate-item">
          <span>RRR:</span>
          <span class="rate-value">{{ requiredRunRate }}</span>
          <span class="target-info">(Need {{ requiredRuns }})</span>
        </div>
      </div>
    </div>

    <!-- Scoring Controls -->
    <div class="scoring-panel" style="background: #262626; padding: 20px; border-radius: 8px">
      <div class="runs-grid">
        <button 
          v-for="runs in [0,1,2,3,4,6]" 
          :key="runs"
          @click="addRuns(runs)"
          style="background: #333; color: #fff; padding: 15px; border: none; border-radius: 4px"
          :style="runs === 4 || runs === 6 ? 'background: #2563eb' : ''"
        >
          {{ runs }}
        </button>
      </div>

      <div class="extras-grid">
        <button 
          v-for="extra in ['Wide', 'No Ball', 'Bye', 'Leg Bye']" 
          :key="extra"
          @click="addExtra(extra.toLowerCase())"
          style="background: #404040; color: #fff; padding: 10px; border: none; border-radius: 4px"
        >
          {{ extra }}
        </button>
      </div>

      <button @click="addWicket" style="background: #dc2626; color: #fff; padding: 12px; width: 100%; border: none; border-radius: 4px">
        Wicket
      </button>
    </div>

    <!-- Batsmen Info -->
    <div class="batsmen-panel">
      <div v-for="(batsman, index) in batsmen" :key="index"
           style="background: #262626; padding: 15px; border-radius: 8px; margin: 10px 0"
           :style="batsman.onStrike ? 'border: 2px solid #2563eb' : ''">
        <div style="font-weight: bold">{{ batsman.name }}</div>
        <div style="display: flex; gap: 10px; margin-top: 8px">
          <span style="font-size: 1.2em">{{ batsman.runs }}</span>
          <span style="color: #999">({{ batsman.balls }})</span>
          <div style="margin-left: auto">
            <span style="margin-right: 10px">4s: {{ batsman.fours }}</span>
            <span>6s: {{ batsman.sixes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-panel" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px">
      <button @click="switchStriker" style="background: #404040; color: #fff; padding: 10px; border: none; border-radius: 4px">
        <i class="fas fa-exchange-alt"></i>
        Switch Strike
      </button>
      <button @click="undo" :disabled="!history.length" style="background: #404040; color: #fff; padding: 10px; border: none; border-radius: 4px">
        <i class="fas fa-undo"></i>
        Undo
      </button>
      <button @click="exportToCSV" style="background: #404040; color: #fff; padding: 10px; border: none; border-radius: 4px">
        <i class="fas fa-file-export"></i>
        Export
      </button>
      <button @click="saveMatch" style="background: #16a34a; color: #fff; padding: 10px; border: none; border-radius: 4px">
        <i class="fas fa-save"></i>
        Save
      </button>
    </div>
  </div>

  <!-- Wicket Modal -->
  <div v-if="showWicketModal" class="modal-overlay">
    <div class="modal-card">
      <h3>How was the batsman out?</h3>
      
      <select v-model="wicketDetails.type" class="wicket-select">
        <option value="">Select dismissal type</option>
        <option value="bowled">Bowled</option>
        <option value="caught">Caught</option>
        <option value="lbw">LBW</option>
        <option value="runout">Run Out</option>
        <option value="stumped">Stumped</option>
        <option value="hitwicket">Hit Wicket</option>
      </select>

      <div v-if="wicketDetails.type === 'caught' || wicketDetails.type === 'runout'">
        <input 
          v-model="wicketDetails.fielder"
          type="text"
          placeholder="Fielder's name"
          class="fielder-input"
        />
      </div>

      <div class="new-batsman-section">
        <h4>New Batsman</h4>
        <input 
          v-model="wicketDetails.newBatsman"
          type="text"
          placeholder="Enter new batsman's name"
          class="batsman-input"
        />
      </div>

      <div class="modal-actions">
        <button 
          @click="cancelWicket" 
          class="btn btn-cancel"
        >
          Cancel
        </button>
        <button 
          @click="confirmWicket"
          :disabled="!isWicketDetailsValid"
          class="btn btn-danger"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modern color scheme */
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --danger: #dc2626;
  --success: #16a34a;
  --warning: #d97706;
  --background: #f8fafc;
  --text: #1e293b;
  --border: #e2e8f0;
  --highlight: #3b82f6;
}

/* Base styles */
.scorer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background: var(--background);
}

/* Score board styles */
.score-board {
  background: linear-gradient(135deg, #1e40af, #1d4ed8);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.team-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.main-score {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.score-value {
  margin-right: 1rem;
}

.overs-value {
  font-size: 2rem;
  opacity: 0.9;
}

.run-rates {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 1.2rem;
}

/* Control buttons */
.scoring-panel {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
}

.runs-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

.score-btn {
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  background: white;
  color: var(--text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.score-btn.boundary {
  background: var(--highlight);
  color: white;
}

.extras-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.extra-btn {
  padding: 1rem;
  font-size: 1.2rem;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.wicket-btn {
  padding: 1.25rem;
  font-size: 1.3rem;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

/* Batsmen display */
.batsmen-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
}

.batsman-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.batsman-card.on-strike {
  border: 2px solid var(--highlight);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 400px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .runs-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .extras-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .batsmen-panel {
    grid-template-columns: 1fr;
  }
  
  .score-btn {
    padding: 1.25rem;
    font-size: 1.25rem;
  }
}
</style>