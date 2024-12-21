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
  return matchInfo.value.targetScore - score.value
})

const requiredRunRate = computed(() => {
  if (!matchInfo.value.targetScore) return null
  const remainingRuns = matchInfo.value.targetScore - score.value
  const remainingOvers = settings.value.maxOvers - (overs.value + balls.value/6)
  return remainingOvers > 0 ? (remainingRuns / remainingOvers).toFixed(2) : 'N/A'
})

// Game actions
const saveState = () => {
  history.value.push({
    score: score.value,
    wickets: wickets.value,
    overs: overs.value,
    balls: balls.value,
    extras: {
      wides: extras.wides.value,
      noBalls: extras.noBalls.value,
      byes: extras.byes.value,
      legByes: extras.legByes.value
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
      const runs = parseInt(prompt('How many runs?') || '0')
      if (type === 'bye') extras.byes.value += runs
      else extras.legByes.value += runs
      score.value += runs
      addBall()
      break
  }
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
  const elements = ['battingTeam', 'bowlingTeam', 'targetScore', 'maxOvers', 'striker', 'nonStriker']
  const values = elements.map(id => document.getElementById(id)?.value || '')

  matchInfo.value.battingTeam = values[0]
  matchInfo.value.bowlingTeam = values[1]
  matchInfo.value.targetScore = values[2] ? parseInt(values[2]) : null
  settings.value.maxOvers = values[3] ? parseInt(values[3]) : 20

  batsmen.value[0].name = values[4]
  batsmen.value[1].name = values[5]

  showInitModal.value = false
}
</script>

<template>
  <!-- Template remains unchanged -->
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
</style>