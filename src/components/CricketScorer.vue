<script setup>
import { ref, computed, onMounted, watch } from 'vue'

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
  { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true, dismissalType: null, dismissedBy: null, fielder: null },
  { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false, dismissalType: null, dismissedBy: null, fielder: null }
])

const currentBowler = ref({
  name: '',
  overs: 0,
  balls: 0,
  runs: 0,
  wickets: 0,
  maidens: 0,
  runsInOver: 0,
  economy: 0
})

// Match settings
const settings = ref({
  maxOvers: 20,
  maxWickets: 10,
  powerPlayOvers: 6,
  enforceMaxWickets: true
})

const matchInfo = ref({
  battingTeam: '',
  bowlingTeam: '',
  venue: '',
  date: new Date().toISOString().split('T')[0],
  matchType: 'T20',
  targetScore: null,
  inningsNumber: 1,
  fallOfWickets: [] // Track wicket details with score, over, batsman details
})

// Wicket modal state
const showWicketModal = ref(false)
const wicketDetails = ref({
  type: '',
  fielder: '',
  newBatsman: '',
  bowler: currentBowler.value?.name || '',
  batsmanOut: null, // Reference to the dismissed batsman
  runsOnDismissal: 0,
  ballCount: true, // Whether to count the ball (not counted for no balls)
  isStriker: true, // Whether striker or non-striker is out (for run outs)
  additionalRuns: 0 // Any runs completed before wicket
})

// Validation for wicket details
const isWicketDetailsValid = computed(() => {
  const details = wicketDetails.value
  if (!details.type || !details.newBatsman?.trim()) return false
  
  switch(details.type) {
    case 'caught':
      return !!details.fielder?.trim() && !!currentBowler.value.name
    case 'runout':
      return !!details.fielder?.trim()
    case 'stumped':
      return !!details.fielder?.trim() && !!currentBowler.value.name
    case 'bowled':
    case 'lbw':
    case 'hitwicket':
      return !!currentBowler.value.name
    default:
      return false
  }
})

const canTakeWicket = computed(() => {
  return (
    wickets.value < settings.value.maxWickets &&
    batsmen.value.some(b => b.name) && 
    !showWicketModal.value
  )
})

// Enhanced wicket handling
const addWicket = () => {
  if (!canTakeWicket.value) {
    console.warn('Cannot take wicket: validation failed')
    return
  }
  
  saveState()
  
  // Initialize wicket details
  wicketDetails.value = {
    type: '',
    fielder: '',
    newBatsman: '',
    bowler: currentBowler.value?.name || '',
    batsmanOut: batsmen.value.find(b => b.onStrike),
    runsOnDismissal: 0,
    ballCount: true,
    isStriker: true,
    additionalRuns: 0
  }
  
  showWicketModal.value = true
}

const cancelWicket = () => {
  if (history.value.length > 0) {
    undo() // Restore previous state
  }
  showWicketModal.value = false
  wicketDetails.value = {
    type: '',
    fielder: '',
    newBatsman: '',
    bowler: currentBowler.value?.name || '',
    batsmanOut: null,
    runsOnDismissal: 0,
    ballCount: true,
    isStriker: true,
    additionalRuns: 0
  }
}

const confirmWicket = () => {
  if (!isWicketDetailsValid.value) {
    console.warn('Invalid wicket details')
    return
  }

  const details = wicketDetails.value
  const outBatsman = details.isStriker ? 
    batsmen.value.find(b => b.onStrike) :
    batsmen.value.find(b => !b.onStrike)

  if (!outBatsman) {
    console.error('Could not find batsman to dismiss')
    return
  }

  // Record dismissal details
  outBatsman.dismissalType = details.type
  outBatsman.dismissedBy = details.bowler
  outBatsman.fielder = details.fielder

  // Update match statistics
  wickets.value++
  if (details.type !== 'runout') {
    currentBowler.value.wickets++
  }

  // Record fall of wicket
  matchInfo.value.fallOfWickets.push({
    score: score.value + details.additionalRuns,
    wicketNumber: wickets.value,
    overs: overs.value,
    balls: balls.value,
    batsmanName: outBatsman.name,
    dismissalType: details.type,
    bowler: details.bowler,
    fielder: details.fielder,
    runs: outBatsman.runs,
    balls: outBatsman.balls
  })

  // Add any runs scored before wicket
  if (details.additionalRuns > 0) {
    score.value += details.additionalRuns
    outBatsman.runs += details.additionalRuns
    if (details.ballCount) {
      outBatsman.balls++
    }
  }

  // Replace dismissed batsman
  const batsmanIndex = batsmen.value.indexOf(outBatsman)
  batsmen.value[batsmanIndex] = {
    name: details.newBatsman.trim(),
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    onStrike: outBatsman.onStrike,
    dismissalType: null,
    dismissedBy: null,
    fielder: null
  }

  // Count the ball if applicable
  if (details.ballCount) {
    addBall()
  }

  showWicketModal.value = false
}

// Rest of the component code remains the same...
</script>

<template>
  <!-- Previous template code remains the same until wicket modal -->

  <!-- Enhanced Wicket Modal -->
  <Teleport to="body">
    <div v-if="showWicketModal" class="modal-overlay" @click.self="cancelWicket">
      <div class="modal-content" role="dialog" aria-labelledby="wicket-modal-title">
        <h3 id="wicket-modal-title" class="modal-title">Wicket Details</h3>
        
        <form @submit.prevent="confirmWicket" class="wicket-form">
          <div class="form-group">
            <label for="dismissal-type" class="form-label">Dismissal Type *</label>
            <select 
              v-model="wicketDetails.type" 
              id="dismissal-type"
              class="modal-select"
              required
            >
              <option value="">Select dismissal type</option>
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="runout">Run Out</option>
              <option value="stumped">Stumped</option>
              <option value="hitwicket">Hit Wicket</option>
            </select>
          </div>

          <div v-if="wicketDetails.type === 'runout'" class="form-group">
            <label class="form-label">Who is out? *</label>
            <div class="radio-group">
              <label>
                <input 
                  type="radio" 
                  v-model="wicketDetails.isStriker" 
                  :value="true"
                > Striker
              </label>
              <label>
                <input 
                  type="radio" 
                  v-model="wicketDetails.isStriker" 
                  :value="false"
                > Non-striker
              </label>
            </div>
          </div>

          <div v-if="['caught', 'runout', 'stumped'].includes(wicketDetails.type)" class="form-group">
            <label for="fielder-name" class="form-label">Fielder's Name *</label>
            <input 
              v-model="wicketDetails.fielder"
              id="fielder-name"
              type="text"
              class="modal-input"
              required
              placeholder="Enter fielder's name"
            />
          </div>

          <div v-if="wicketDetails.type === 'runout'" class="form-group">
            <label for="additional-runs" class="form-label">Runs Completed</label>
            <input 
              v-model.number="wicketDetails.additionalRuns"
              id="additional-runs"
              type="number"
              min="0"
              max="3"
              class="modal-input"
            />
          </div>

          <div class="form-group">
            <label for="new-batsman" class="form-label">New Batsman *</label>
            <input 
              v-model="wicketDetails.newBatsman"
              id="new-batsman"
              type="text"
              class="modal-input"
              required
              placeholder="Enter new batsman's name"
            />
          </div>

          <div class="modal-actions">
            <button 
              type="button"
              @click="cancelWicket" 
              class="modal-btn cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="!isWicketDetailsValid"
              class="modal-btn confirm-btn"
            >
              Confirm Wicket
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Rest of the template remains the same -->
</template>

<style scoped>
/* Previous styles remain the same */

/* Enhanced Modal Styles */
.modal-content {
  background: #1a1a1a;
  color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #fff;
}

.wicket-form {
  display: grid;
  gap: 1.25rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
}

.modal-select,
.modal-input {
  background: #333;
  color: #fff;
  border: 1px solid #666;
  padding: 0.75rem;
  border-radius: 0.5rem;
  width: 100%;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #4b5563;
  color: #fff;
}

.confirm-btn {
  background: #2563eb;
  color: #fff;
}

.confirm-btn:disabled {
  background: #64748b;
  cursor: not-allowed;
}

/* Rest of the styles remain the same */
</style>