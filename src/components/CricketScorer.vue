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

// Add new state for modals
const showExtraRunsModal = ref(false)
const showNewBowlerModal = ref(false)
const extraRunsType = ref('')
const extraRunsAmount = ref(0)
const newBowlerName = ref('')

// Add these refs at the top with other state
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

// Computed stats
const runRate = computed(() => {
  const totalOvers = overs.value + (balls.value / 6)
  return totalOvers > 0 ? (score.value / totalOvers).toFixed(2) : '0.00'
})

const totalExtras = computed(() => {
  return extras.wides.value + extras.noBalls.value + extras.byes.value + extras.legByes.value
})

const requiredRuns = computed(() => {
  if (!matchInfo.value.targetScore) return null
  const remainingRuns = matchInfo.value.targetScore - score.value
  return remainingRuns >= 0 ? remainingRuns : 0
})

const requiredRunRate = computed(() => {
  if (!matchInfo.value.targetScore) return null
  const remainingRuns = requiredRuns.value
  const remainingBalls = (settings.value.maxOvers * 6) - (overs.value * 6 + balls.value)
  const remainingOvers = remainingBalls / 6

  if (remainingOvers <= 0 || remainingRuns <= 0) return '0.00'
  return (remainingRuns / remainingOvers).toFixed(2)
})

// Game actions
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
  if (striker) {
    striker.runs += runs
    striker.balls++
    if (runs === 4) striker.fours++
    if (runs === 6) striker.sixes++
  }
}

const updateBowlerStats = (runs, isExtra = false) => {
  if (!isExtra) {
    currentBowler.value.runs += runs
    currentBowler.value.runsInOver += runs
  }
}

const addRuns = (runs, isExtra = false) => {
  saveState()
  score.value += runs
  if (!isExtra) {
    updateBatsmanScore(runs)
    updateBowlerStats(runs)
  }
}

const addExtra = (type) => {
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
  if (newBowlerName.value) {
    currentBowler.value.name = newBowlerName.value
    updateBallCount()
    showNewBowlerModal.value = false
    newBowlerName.value = ''
  }
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
  saveState()
  if (wickets.value < settings.value.maxWickets) {
    showWicketModal.value = true
  }
}

const confirmWicket = (outBatsman, newBatsman) => {
  if (wickets.value < settings.value.maxWickets) {
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

const initializeInnings = () => {
  // Validate required fields
  if (!initForm.value.battingTeam || !initForm.value.bowlingTeam || 
      !initForm.value.striker || !initForm.value.nonStriker) {
    alert('Please fill in all required fields')
    return
  }

  // Update match info
  matchInfo.value = {
    battingTeam: initForm.value.battingTeam,
    bowlingTeam: initForm.value.bowlingTeam,
    venue: initForm.value.venue,
    date: new Date().toISOString().split('T')[0],
    matchType: initForm.value.matchType,
    targetScore: initForm.value.targetScore ? parseInt(initForm.value.targetScore) : null
  }

  // Update settings
  settings.value.maxOvers = initForm.value.maxOvers

  // Initialize batsmen
  batsmen.value = [
    { name: initForm.value.striker, runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true },
    { name: initForm.value.nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false }
  ]

  showInitModal.value = false
}
</script>

<template>
  <!-- Main Scoring Interface -->
  <div class="scoring-interface">
    <!-- Primary Score Display -->
    <div class="score-board">
      <div class="main-score">
        <div class="score-wrapper">
          <span class="runs">{{ score.value }}</span>
          <span class="divider">/</span>
          <span class="wickets">{{ wickets.value }}</span>
          <span class="overs">({{ overs.value }}.{{ balls.value }})</span>
        </div>
        <div class="run-rate">
          <span>CRR: {{ runRate }}</span>
          <span v-if="requiredRunRate">RRR: {{ requiredRunRate }}</span>
        </div>
      </div>
      <div class="target-info" v-if="matchInfo.value.targetScore">
        <div class="target">Target: {{ matchInfo.value.targetScore }}</div>
        <div class="needs">Need {{ requiredRuns }} from {{ (settings.value.maxOvers - overs.value - balls.value/6).toFixed(1) }} ov</div>
      </div>
    </div>

    <!-- Active Players Panel -->
    <div class="players-panel">
      <div class="batsmen">
        <div v-for="batsman in batsmen.value" :key="batsman.name" 
             :class="['batsman-card', { 'on-strike': batsman.onStrike }]">
          <div class="player-name">{{ batsman.name || 'Batsman' }}</div>
          <div class="stats-row">
            <span class="runs">{{ batsman.runs }}*</span>
            <span class="balls">({{ batsman.balls }})</span>
            <span class="boundaries">{{ batsman.fours }}×4 {{ batsman.sixes }}×6</span>
            <span class="strike-rate">
              SR: {{ batsman.balls ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0' }}
            </span>
          </div>
        </div>
      </div>
      <div class="bowler-card" v-if="currentBowler.value.name">
        <div class="player-name">{{ currentBowler.value.name }}</div>
        <div class="stats-row">
          <span>{{ currentBowler.value.overs }}.{{ currentBowler.value.balls }}-{{ currentBowler.value.maidens }}-{{ currentBowler.value.runs }}-{{ currentBowler.value.wickets }}</span>
        </div>
      </div>
    </div>

    <!-- Scoring Controls -->
    <div class="scoring-controls">
      <div class="primary-actions">
        <div class="runs-grid">
          <button v-for="runs in [0,1,2,3,4,6]" 
                  :key="runs"
                  @click="addRuns(runs)"
                  :class="['btn-run', {'boundary': runs === 4 || runs === 6}]">
            {{ runs }}
          </button>
        </div>
        <div class="extras-grid">
          <button @click="addExtra('wide')" class="btn-extra">Wide</button>
          <button @click="addExtra('no-ball')" class="btn-extra">No Ball</button>
          <button @click="addExtra('bye')" class="btn-extra">Bye</button>
          <button @click="addExtra('leg-bye')" class="btn-extra">Leg Bye</button>
        </div>
      </div>
      <div class="secondary-actions">
        <button @click="addWicket" class="btn-wicket">
          <span class="icon">🎯</span>
          Wicket
        </button>
        <button @click="switchStriker" class="btn-switch">
          <span class="icon">🔄</span>
          Switch Ends
        </button>
        <button @click="undo" class="btn-undo">
          <span class="icon">↩️</span>
          Undo
        </button>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <div v-if="showExtraRunsModal" class="modal" @click.self="showExtraRunsModal = false">
    <div class="modal-content">
      <header class="modal-header">
        <h3>{{ extraRunsType === 'bye' ? 'Byes' : 'Leg Byes' }}</h3>
        <button class="close-btn" @click="showExtraRunsModal = false">×</button>
      </header>
      <div class="modal-body">
        <div class="form-group">
          <label>Select Runs</label>
          <div class="runs-quick-select">
            <button 
              v-for="n in 4" 
              :key="n" 
              @click="extraRunsAmount = n"
              :class="['quick-select-btn', { active: extraRunsAmount === n }]"
            >
              {{ n }}
            </button>
          </div>
          <input 
            v-model="extraRunsAmount" 
            type="number" 
            min="0" 
            max="6"
            placeholder="Or enter custom amount"
          >
        </div>
      </div>
      <footer class="modal-footer">
        <button @click="showExtraRunsModal = false" class="btn-secondary">Cancel</button>
        <button @click="confirmExtraRuns" class="btn-primary">Confirm</button>
      </footer>
    </div>
  </div>

  <div v-if="showNewBowlerModal" class="modal" @click.self="showNewBowlerModal = false">
    <div class="modal-content">
      <header class="modal-header">
        <h3>New Bowler</h3>
        <button class="close-btn" @click="showNewBowlerModal = false">×</button>
      </header>
      <div class="modal-body">
        <div class="form-group">
          <label>Bowler Name</label>
          <input 
            v-model="newBowlerName" 
            type="text" 
            placeholder="Enter bowler name"
            @keyup.enter="confirmNewBowler"
            ref="bowlerInput"
            class="bowler-input"
            autocomplete="off"
          >
        </div>
      </div>
      <footer class="modal-footer">
        <button @click="showNewBowlerModal = false" class="btn-secondary">Cancel</button>
        <button @click="confirmNewBowler" class="btn-primary">Start Over</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.score-display {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0;
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.modal {
  background: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.stats-table th,
.stats-table td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  text-align: left;
}

.stats-table th {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .controls {
    grid-template-columns: 1fr;
  }
  
  .btn {
    width: 100%;
  }
}

.runs-quick-select {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.quick-select-btn {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-soft);
  cursor: pointer;
}

.quick-select-btn.active {
  background: var(--color-heading);
  color: white;
  border-color: var(--color-heading);
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .quick-select-btn {
    padding: 1rem;
    font-size: 1.2rem;
  }

  input[type="number"] {
    font-size: 1.2rem;
    padding: 0.8rem;
  }
}
</style>