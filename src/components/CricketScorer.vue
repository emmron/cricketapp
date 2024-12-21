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
/* Modal Styles */
.modal-content {
  background: linear-gradient(135deg, #ffffff, #f0f9ff);
  color: #0f172a;
  padding: 3rem;
  border-radius: 2rem;
  width: 95%;
  max-width: 650px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 8px 24px -4px rgba(0, 0, 0, 0.15),
    inset 0 2px 4px 0 rgba(255, 255, 255, 0.95);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.98);
  z-index: 1000;
  border: 1px solid rgba(255,255,255,0.7);
  backdrop-filter: blur(16px);
  animation: modalPop 0.3s ease forwards;
}

@keyframes modalPop {
  0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -1px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  position: relative;
}

.modal-title::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 6px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.wicket-form {
  display: grid;
  gap: 2.5rem;
}

.form-group {
  display: grid;
  gap: 1rem;
  position: relative;
  animation: slideUp 0.4s ease forwards;
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.form-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.modal-select,
.modal-input {
  background: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  border: 3px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  width: 100%;
  font-size: 1.2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}

.modal-select:hover,
.modal-input:hover {
  border-color: #93c5fd;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.15);
}

.modal-select:focus,
.modal-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 
    0 0 0 4px rgba(59, 130, 246, 0.25),
    0 8px 16px rgba(0,0,0,0.1);
  background: #ffffff;
  transform: translateY(-3px);
}

.radio-group {
  display: flex;
  gap: 3rem;
  padding: 1rem 0;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #0f172a;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.5);
}

.radio-group label:hover {
  background: rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 3px solid rgba(226, 232, 240, 0.8);
}

.modal-btn {
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 1.25rem;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.modal-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.cancel-btn {
  background: linear-gradient(135deg, #64748b, #475569);
  color: #ffffff;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #475569, #334155);
}

.confirm-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.confirm-btn:disabled {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  cursor: not-allowed;
  transform: none;
  opacity: 0.7;
  box-shadow: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>