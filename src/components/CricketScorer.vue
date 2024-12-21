<script setup>
import { ref, computed } from 'vue'

// Add error logging utility
const logError = (context, error) => {
  console.error(`[CricketScorer] ${context}:`, error)
  return false
}

// Core state management using immutable state pattern
const createInitialState = () => {
  try {
    return {
      score: ref(0),
      wickets: ref(0),
      overs: ref(0),
      balls: ref(0),
      extras: {
        wides: ref(0),
        noBalls: ref(0),
        byes: ref(0),
        legByes: ref(0)
      },
      history: ref([])
    }
  } catch (err) {
    logError('Failed to create initial state', err)
    throw new Error('Game initialization failed')
  }
}

// Player state management using entity pattern
const createBatsman = (isOnStrike = false) => ({
  id: crypto.randomUUID(),
  name: '',
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  onStrike: isOnStrike,
  dismissalType: null,
  dismissedBy: null,
  fielder: null,
  strikeRate: computed(() => balls > 0 ? (runs / balls) * 100 : 0)
})

const createBowler = () => ({
  id: crypto.randomUUID(),
  name: '',
  overs: 0,
  balls: 0,
  runs: 0,
  wickets: 0,
  maidens: 0,
  runsInOver: 0,
  economy: computed(() => {
    const totalOvers = overs + (balls / 6)
    return totalOvers > 0 ? runs / totalOvers : 0
  })
})

// Match configuration using singleton pattern with validation
const matchConfig = {
  settings: ref({
    maxOvers: 20,
    maxWickets: 10,
    powerPlayOvers: 6,
    enforceMaxWickets: true,
    allowExtraTime: false,
    drsEnabled: false
  }),
  
  matchInfo: ref({
    id: crypto.randomUUID(),
    battingTeam: '',
    bowlingTeam: '',
    venue: '',
    date: new Date().toISOString().split('T')[0],
    matchType: 'T20',
    targetScore: null,
    inningsNumber: 1,
    fallOfWickets: [],
    startTime: null,
    weather: null,
    pitch: null
  }),

  validate() {
    const errors = []
    const s = this.settings.value
    const m = this.matchInfo.value

    if (s.maxOvers < 1) errors.push('Invalid max overs')
    if (s.maxWickets < 1) errors.push('Invalid max wickets')
    if (!m.battingTeam) errors.push('Batting team required')
    if (!m.bowlingTeam) errors.push('Bowling team required')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Initialize core state with error handling
const gameState = (() => {
  try {
    return createInitialState()
  } catch (err) {
    console.error('Failed to initialize game state:', err)
    throw new Error('Game initialization failed')
  }
})()

const batsmen = ref([createBatsman(true), createBatsman(false)])
const currentBowler = ref(createBowler())

// Add validation computed properties
const validators = {
  canTakeWicket: computed(() => {
    try {
      return (
        gameState.wickets.value < matchConfig.settings.value.maxWickets &&
        batsmen.value.some(b => b.name) &&
        !WicketCommand.state.value.showModal &&
        currentBowler.value?.name
      )
    } catch (err) {
      logError('Wicket validation failed', err)
      return false
    }
  }),

  isDetailsValid: computed(() => {
    try {
      const details = WicketCommand.state.value.details
      if (!details.type || !details.newBatsman?.trim()) return false

      const validations = {
        caught: () => details.fielder?.trim() && currentBowler.value.name,
        runout: () => details.fielder?.trim(),
        stumped: () => details.fielder?.trim() && currentBowler.value.name,
        bowled: () => currentBowler.value.name,
        lbw: () => currentBowler.value.name,
        hitwicket: () => currentBowler.value.name,
        retired: () => true
      }

      return validations[details.type]?.() ?? false
    } catch (err) {
      logError('Details validation failed', err) 
      return false
    }
  })
}

// Add debugging helpers
const DEBUG = process.env.NODE_ENV !== 'production'

const debugLog = (...args) => {
  if (DEBUG) {
    console.log('[CricketScorer]', ...args)
  }
}

// Wicket handling using command pattern with error boundaries
const WicketCommand = {
  state: ref({
    showModal: false,
    details: {
      type: '',
      fielder: '',
      newBatsman: '',
      bowler: '',
      batsmanOut: null,
      runsOnDismissal: 0,
      ballCount: true,
      isStriker: true,
      additionalRuns: 0,
      timestamp: null,
      reviewTaken: false
    }
  }),

  execute: {
    add() {
      debugLog('Adding wicket')
      if (!validators.canTakeWicket.value) {
        return logError('Cannot take wicket: validation failed')
      }

      try {
        // Save state for undo with timestamp
        const currentState = {
          gameState: { ...gameState },
          batsmen: [...batsmen.value],
          bowler: { ...currentBowler.value }
        }
        
        debugLog('Saving current state', currentState)
        
        gameState.history.value.push({
          timestamp: new Date().toISOString(),
          state: JSON.stringify(currentState)
        })

        this.state.value = {
          showModal: true,
          details: this.getInitialDetails()
        }
        return true
      } catch (err) {
        return logError('Failed to add wicket', err)
      }
    },

    cancel() {
      try {
        if (gameState.history.value.length) {
          const previousState = JSON.parse(gameState.history.value.pop().state)
          Object.assign(gameState, previousState.gameState)
          batsmen.value = previousState.batsmen
          currentBowler.value = previousState.bowler
        }
        
        this.state.value.showModal = false
        this.state.value.details = this.getInitialDetails()
        return true
      } catch (err) {
        console.error('Failed to cancel wicket:', err)
        return false
      }
    },

    confirm() {
      if (!validators.isDetailsValid.value) {
        console.warn('Invalid wicket details')
        return false
      }

      const details = this.state.value.details
      const outBatsman = details.isStriker ? 
        batsmen.value.find(b => b.onStrike) :
        batsmen.value.find(b => !b.onStrike)

      if (!outBatsman) {
        console.error('Could not find batsman to dismiss')
        return false
      }

      try {
        // Transaction-like atomic updates
        const updates = () => {
          // Update batsman stats
          outBatsman.dismissalType = details.type
          outBatsman.dismissedBy = details.bowler
          outBatsman.fielder = details.fielder

          // Update match stats
          gameState.wickets.value++
          if (details.type !== 'runout' && details.type !== 'retired') {
            currentBowler.value.wickets++
          }

          // Record fall of wicket with enhanced details
          matchConfig.matchInfo.value.fallOfWickets.push({
            score: gameState.score.value + details.additionalRuns,
            wicketNumber: gameState.wickets.value,
            overs: gameState.overs.value,
            balls: gameState.balls.value,
            batsmanName: outBatsman.name,
            dismissalType: details.type,
            bowler: details.bowler,
            fielder: details.fielder,
            runs: outBatsman.runs,
            balls: outBatsman.balls,
            timestamp: details.timestamp,
            partnership: this.calculatePartnership(outBatsman),
            reviewTaken: details.reviewTaken
          })

          // Handle additional runs
          if (details.additionalRuns > 0) {
            gameState.score.value += details.additionalRuns
            outBatsman.runs += details.additionalRuns
            if (details.ballCount) {
              outBatsman.balls++
            }
          }

          // Replace dismissed batsman
          const batsmanIndex = batsmen.value.indexOf(outBatsman)
          batsmen.value[batsmanIndex] = createBatsman()
          batsmen.value[batsmanIndex].name = details.newBatsman.trim()
          batsmen.value[batsmanIndex].onStrike = outBatsman.onStrike

          // Update ball count
          if (details.ballCount) {
            this.addBall()
          }
        }

        updates()
        this.state.value.showModal = false
        return true
      } catch (err) {
        console.error('Failed to confirm wicket:', err)
        return false
      }
    },

    calculatePartnership(outBatsman) {
      // Calculate partnership runs and balls
      const partnershipDetails = {
        runs: 0,
        balls: 0,
        partner: batsmen.value.find(b => b !== outBatsman)?.name || 'Unknown'
      }
      return partnershipDetails
    },

    getInitialDetails() {
      return {
        type: '',
        fielder: '',
        newBatsman: '',
        bowler: currentBowler.value?.name || '',
        batsmanOut: null,
        runsOnDismissal: 0,
        ballCount: true,
        isStriker: true,
        additionalRuns: 0,
        timestamp: null,
        reviewTaken: false
      }
    },

    addBall() {
      gameState.balls.value++
      if (gameState.balls.value === 6) {
        gameState.overs.value++
        gameState.balls.value = 0
      }
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="WicketCommand.state.value.showModal" 
         class="modal-overlay" 
         @click.self="WicketCommand.execute.cancel"
         role="dialog"
         aria-modal="true">
      <div class="modal-content" aria-labelledby="wicket-modal-title">
        <h3 id="wicket-modal-title" class="modal-title">Wicket Details</h3>
        
        <form @submit.prevent="WicketCommand.execute.confirm" class="wicket-form">
          <div class="form-group">
            <label for="dismissal-type" class="form-label">Dismissal Type *</label>
            <select 
              v-model="WicketCommand.state.value.details.type" 
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
              <option value="retired">Retired</option>
            </select>
          </div>

          <div v-if="WicketCommand.state.value.details.type === 'runout'" class="form-group">
            <label class="form-label">Who is out? *</label>
            <div class="radio-group">
              <label>
                <input 
                  type="radio" 
                  v-model="WicketCommand.state.value.details.isStriker" 
                  :value="true"
                > Striker
              </label>
              <label>
                <input 
                  type="radio" 
                  v-model="WicketCommand.state.value.details.isStriker" 
                  :value="false"
                > Non-striker
              </label>
            </div>
          </div>

          <div v-if="['caught', 'runout', 'stumped'].includes(WicketCommand.state.value.details.type)" 
               class="form-group">
            <label for="fielder-name" class="form-label">Fielder's Name *</label>
            <input 
              v-model="WicketCommand.state.value.details.fielder"
              id="fielder-name"
              type="text"
              class="modal-input"
              required
              placeholder="Enter fielder's name"
            />
          </div>

          <div v-if="WicketCommand.state.value.details.type === 'runout'" class="form-group">
            <label for="additional-runs" class="form-label">Runs Completed</label>
            <input 
              v-model.number="WicketCommand.state.value.details.additionalRuns"
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
              v-model="WicketCommand.state.value.details.newBatsman"
              id="new-batsman"
              type="text"
              class="modal-input"
              required
              placeholder="Enter new batsman's name"
            />
          </div>

          <div v-if="matchConfig.settings.value.drsEnabled" class="form-group">
            <label>
              <input 
                type="checkbox"
                v-model="WicketCommand.state.value.details.reviewTaken"
              > DRS Review Taken
            </label>
          </div>

          <div class="modal-actions">
            <button 
              type="button"
              @click="WicketCommand.execute.cancel" 
              class="modal-btn cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="!WicketCommand.validators.isDetailsValid"
              class="modal-btn confirm-btn"
            >
              Confirm Wicket
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 95%;
  max-width: 650px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}
</style>