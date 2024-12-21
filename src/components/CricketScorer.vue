<script setup>
import { ref, computed } from 'vue'

// Core game state using 2D matrix for ball-by-ball tracking
const gameMatrix = ref(Array(50).fill().map(() => Array(6).fill(null)))

// Current position in the matrix
const currentPosition = ref({
  over: 0,
  ball: 0
})

// Game state
const game = ref({
  score: 0,
  wickets: 0,
  extras: {
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0
  },
  target: null,
  result: null
})

// Partnership matrix tracks runs scored between wickets
const partnershipMatrix = ref([])

// Over matrix tracks runs per over
const overMatrix = ref(Array(50).fill(0))

// Batsmen matrix tracks who batted at each position
const batsmenMatrix = ref(Array(11).fill().map((_, index) => ({
  name: '',
  position: index + 1,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  dismissal: null,
  timeline: [] // Array of ball-by-ball scoring
})))

// Bowlers matrix tracks overs bowled by each bowler
const bowlersMatrix = ref(Array(11).fill().map(() => ({
  name: '',
  overs: Array(50).fill().map(() => ({
    runs: 0,
    wickets: 0,
    balls: Array(6).fill(null)
  }))
})))

// Add these constants at the top of the script
const MAX_OVERS = 50
const MAX_WICKETS = 10

// Add this state near the top of the script setup
const wicketModal = ref({
  show: false,
  details: {
    type: 'bowled',
    fielder: '',
    newBatsman: '',
    runs: 0
  }
})

// Computed properties
const currentOver = computed(() => {
  const over = gameMatrix.value[currentPosition.value.over]
  return over.filter(ball => ball !== null).length
})

const runRate = computed(() => {
  const totalOvers = currentPosition.value.over + (currentOver.value / 6)
  return totalOvers > 0 ? game.value.score / totalOvers : 0
})

// Add this computed property after other computed properties
const activeBatsmen = computed(() => {
  return batsmenMatrix.value.filter(batsman => batsman.name)
})

// Ball recording function
const recordBall = (details) => {
  const { over, ball } = currentPosition.value
  
  // Validate over bounds
  if (over >= MAX_OVERS) {
    console.warn('Maximum overs reached')
    return
  }

  // Ensure required properties exist
  const ballDetails = {
    ...details,
    striker: strikerPosition.value,
    bowler: currentBowler.value?.name,
    timestamp: new Date().toISOString()
  }
  
  // Record in game matrix
  gameMatrix.value[over][ball] = ballDetails

  // Update game score
  game.value.score += ballDetails.runs

  // Update batsman matrix
  const striker = batsmenMatrix.value.find(b => b.position === ballDetails.striker)
  if (striker) {
    striker.timeline.push(ballDetails)
    striker.runs += ballDetails.runs
    striker.balls++
    if (ballDetails.runs === 4) striker.fours++
    if (ballDetails.runs === 6) striker.sixes++
  }

  // Update bowler matrix
  const bowler = bowlersMatrix.value.find(b => b.name === ballDetails.bowler)
  if (bowler) {
    bowler.overs[over].balls[ball] = ballDetails
    bowler.overs[over].runs += ballDetails.runs
    if (ballDetails.wicket) bowler.overs[over].wickets++
  }

  // Update over matrix
  overMatrix.value[over] += ballDetails.runs

  // Move to next ball
  if (ball === 5) {
    if (over + 1 < MAX_OVERS) {
      currentPosition.value = {
        over: over + 1,
        ball: 0
      }
    }
  } else {
    currentPosition.value.ball++
  }
}

// Wicket handling
const takeWicket = (details) => {
  // If no details provided, show modal instead
  if (!details) {
    wicketModal.value.show = true
    return
  }

  // Validate wickets
  if (game.value.wickets >= MAX_WICKETS) {
    console.warn('Maximum wickets reached')
    return
  }

  // Get current bowler before recording wicket
  const bowler = currentBowler.value?.name
  if (!bowler) {
    console.error('No current bowler selected')
    return
  }

  const outBatsmanPosition = strikerPosition.value
  const outBatsman = batsmenMatrix.value.find(b => b.position === outBatsmanPosition)
  
  if (!outBatsman) {
    console.error('Could not find batsman to dismiss')
    return
  }

  // Record wicket in matrices
  const wicketBall = {
    type: 'W',
    runs: details?.runs || 0,
    striker: outBatsmanPosition,
    bowler: bowler, // Use the retrieved bowler name
    wicket: {
      type: details?.type || 'bowled',
      batsman: outBatsman.name,
      fielder: details?.fielder,
      bowler: bowler // Use the retrieved bowler name
    }
  }

  // Record the ball
  recordBall(wicketBall)

  // Update partnership matrix with correct wicket number
  partnershipMatrix.value.push({
    wicketNumber: game.value.wickets, // Remove the +1 since wickets haven't been incremented yet
    runs: calculatePartnershipRuns(),
    batsmen: [outBatsman.name, currentPartner.value?.name]
  })

  // Update batsman's dismissal
  outBatsman.dismissal = wicketBall.wicket

  // Update game state
  game.value.wickets++

  // Add new batsman if provided
  if (details?.newBatsman) {
    const newPosition = batsmenMatrix.value.findIndex(b => !b.name)
    if (newPosition >= 0) {
      batsmenMatrix.value[newPosition] = {
        name: details.newBatsman,
        position: newPosition + 1,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        dismissal: null,
        timeline: []
      }
    }
  }
}

// Helper functions
const calculatePartnershipRuns = () => {
  const lastWicket = partnershipMatrix.value.length
  const runsAtLastWicket = lastWicket > 0 ? 
    partnershipMatrix.value[lastWicket - 1].totalRuns : 0
  return game.value.score - runsAtLastWicket
}

const currentPartner = computed(() => {
  return batsmenMatrix.value.find(b => 
    b.name && !b.dismissal && b !== currentStriker.value
  )
})

const currentStriker = computed(() => {
  return batsmenMatrix.value.find(b => 
    b.name && !b.dismissal && b.position === strikerPosition.value
  )
})

const strikerPosition = ref(1)

// Add this computed property for the current bowler
const currentBowler = computed(() => {
  return bowlersMatrix.value.find(b => b.name && !b.overs[currentPosition.value.over].complete)
})

// Add this new method to handle modal confirmation
const confirmWicket = () => {
  takeWicket(wicketModal.value.details)
  wicketModal.value.show = false
  // Reset form
  wicketModal.value.details = {
    type: 'bowled',
    fielder: '',
    newBatsman: '',
    runs: 0
  }
}
</script>

<template>
  <div class="scorer">
    <div class="score-display">
      <h2>{{ game.score }}/{{ game.wickets }}</h2>
      <p>Overs: {{ currentPosition.over }}.{{ currentOver }}</p>
      <p>Run Rate: {{ runRate.toFixed(2) }}</p>
    </div>

    <div class="matrix-display">
      <h3>Current Over</h3>
      <div class="over-matrix">
        <div v-for="(ball, i) in gameMatrix[currentPosition.over]" 
             :key="i"
             class="ball"
             :class="{ current: i === currentPosition.ball }">
          {{ ball?.runs || '-' }}
        </div>
      </div>
    </div>

    <div class="batsmen-display">
      <div v-for="batsman in activeBatsmen" 
           :key="batsman.position"
           class="batsman-row">
        <span>{{ batsman.name }}</span>
        <span>{{ batsman.runs }}({{ batsman.balls }})</span>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="takeWicket">Wicket</button>
      <button v-for="runs in [0,1,2,3,4,6]" 
              :key="runs"
              @click="recordBall({runs})">
        {{ runs }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.scorer {
  padding: 2rem;
}

.score-display {
  text-align: center;
  margin-bottom: 2rem;
}

.matrix-display {
  margin: 2rem 0;
}

.over-matrix {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.ball {
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: center;
}

.ball.current {
  background: #e9ecef;
}

.batsmen-display {
  margin: 2rem 0;
}

.batsman-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.5rem;
  margin-top: 2rem;
}

button {
  padding: 1rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>