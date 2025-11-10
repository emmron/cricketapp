<script setup>
import { ref, computed, watch } from 'vue'

// Game state
const activeTab = ref('calendar')
const simulationSpeed = ref(400)

// Team data
const teamName = ref('Melbourne Demons')
const budget = ref(15000000)
const reputation = ref(75)

// Season state
const currentRound = ref(1)
const seasonYear = ref(2024)
const MAX_ROUNDS = 27 // 23 home-and-away + 4 finals rounds
const FINALS_START_ROUND = 24

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
  quarterBreak: false,
  round: 1
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

// Season fixtures - generated for 23 rounds
const fixtures = ref([])

// Finals state
const finalsActive = ref(false)
const finalsFixtures = ref([])
const premiersTeam = ref(null)

// Generate season fixtures
const generateFixtures = () => {
  const teams = standings.value.map(t => t.team)
  const allFixtures = []

  // Simple round-robin generation (each team plays each other once + byes)
  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const roundMatches = []
    const teamsThisRound = [...teams]

    // Shuffle teams for variety
    teamsThisRound.sort(() => Math.random() - 0.5)

    // Create matches (9 matches per round, some teams get byes)
    for (let i = 0; i < teamsThisRound.length - 1; i += 2) {
      if (teamsThisRound[i + 1]) {
        roundMatches.push({
          round,
          homeTeam: teamsThisRound[i],
          awayTeam: teamsThisRound[i + 1],
          homeScore: null,
          awayScore: null,
          played: false
        })
      }
    }

    allFixtures.push(...roundMatches)
  }

  fixtures.value = allFixtures
}

// Generate finals bracket from top 8 teams
const generateFinals = () => {
  const top8 = sortedStandings.value.slice(0, 8)

  if (top8.length < 8) {
    console.error('Not enough teams for finals')
    return
  }

  finalsActive.value = true
  finalsFixtures.value = []

  // Week 1 - Qualifying Finals (Round 24)
  finalsFixtures.value.push({
    week: 1,
    round: 24,
    matchType: 'Qualifying Final 1',
    homeTeam: top8[0].team,
    awayTeam: top8[3].team,
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null
  })

  finalsFixtures.value.push({
    week: 1,
    round: 24,
    matchType: 'Qualifying Final 2',
    homeTeam: top8[1].team,
    awayTeam: top8[2].team,
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null
  })

  // Week 1 - Elimination Finals (Round 24)
  finalsFixtures.value.push({
    week: 1,
    round: 24,
    matchType: 'Elimination Final 1',
    homeTeam: top8[4].team,
    awayTeam: top8[7].team,
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    elimination: true
  })

  finalsFixtures.value.push({
    week: 1,
    round: 24,
    matchType: 'Elimination Final 2',
    homeTeam: top8[5].team,
    awayTeam: top8[6].team,
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    elimination: true
  })

  // Week 2 - Semi Finals (Round 25) - TBD based on Week 1 results
  finalsFixtures.value.push({
    week: 2,
    round: 25,
    matchType: 'Semi Final 1',
    homeTeam: null, // Loser QF1
    awayTeam: null, // Winner EF1
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    elimination: true,
    sourceHome: 'QF1_LOSER',
    sourceAway: 'EF1_WINNER'
  })

  finalsFixtures.value.push({
    week: 2,
    round: 25,
    matchType: 'Semi Final 2',
    homeTeam: null, // Loser QF2
    awayTeam: null, // Winner EF2
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    elimination: true,
    sourceHome: 'QF2_LOSER',
    sourceAway: 'EF2_WINNER'
  })

  // Week 3 - Preliminary Finals (Round 26) - TBD based on Week 1 & 2 results
  finalsFixtures.value.push({
    week: 3,
    round: 26,
    matchType: 'Preliminary Final 1',
    homeTeam: null, // Winner QF1
    awayTeam: null, // Winner SF2
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    elimination: true,
    sourceHome: 'QF1_WINNER',
    sourceAway: 'SF2_WINNER'
  })

  finalsFixtures.value.push({
    week: 3,
    round: 26,
    matchType: 'Preliminary Final 2',
    homeTeam: null, // Winner QF2
    awayTeam: null, // Winner SF1
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    elimination: true,
    sourceHome: 'QF2_WINNER',
    sourceAway: 'SF1_WINNER'
  })

  // Week 4 - Grand Final (Round 27)
  finalsFixtures.value.push({
    week: 4,
    round: 27,
    matchType: 'GRAND FINAL',
    homeTeam: null, // Winner PF1
    awayTeam: null, // Winner PF2
    homeScore: null,
    awayScore: null,
    played: false,
    winner: null,
    loser: null,
    grandFinal: true,
    sourceHome: 'PF1_WINNER',
    sourceAway: 'PF2_WINNER'
  })
}

// Update finals matchups based on previous results
const updateFinalsMatchups = () => {
  const qf1 = finalsFixtures.value.find(f => f.matchType === 'Qualifying Final 1')
  const qf2 = finalsFixtures.value.find(f => f.matchType === 'Qualifying Final 2')
  const ef1 = finalsFixtures.value.find(f => f.matchType === 'Elimination Final 1')
  const ef2 = finalsFixtures.value.find(f => f.matchType === 'Elimination Final 2')
  const sf1 = finalsFixtures.value.find(f => f.matchType === 'Semi Final 1')
  const sf2 = finalsFixtures.value.find(f => f.matchType === 'Semi Final 2')
  const pf1 = finalsFixtures.value.find(f => f.matchType === 'Preliminary Final 1')
  const pf2 = finalsFixtures.value.find(f => f.matchType === 'Preliminary Final 2')
  const gf = finalsFixtures.value.find(f => f.matchType === 'GRAND FINAL')

  // Week 2 matchups from Week 1 results
  if (qf1?.played && ef1?.played && !sf1.homeTeam) {
    sf1.homeTeam = qf1.loser
    sf1.awayTeam = ef1.winner
  }
  if (qf2?.played && ef2?.played && !sf2.homeTeam) {
    sf2.homeTeam = qf2.loser
    sf2.awayTeam = ef2.winner
  }

  // Week 3 matchups from Week 1 & 2 results
  if (qf1?.played && sf2?.played && !pf1.homeTeam) {
    pf1.homeTeam = qf1.winner
    pf1.awayTeam = sf2.winner
  }
  if (qf2?.played && sf1?.played && !pf2.homeTeam) {
    pf2.homeTeam = qf2.winner
    pf2.awayTeam = sf1.winner
  }

  // Grand Final matchups from Week 3 results
  if (pf1?.played && pf2?.played && !gf.homeTeam) {
    gf.homeTeam = pf1.winner
    gf.awayTeam = pf2.winner
  }
}

// Initialize fixtures on load
generateFixtures()

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

const currentRoundFixtures = computed(() => {
  if (currentRound.value >= FINALS_START_ROUND) {
    return finalsFixtures.value.filter(f => f.round === currentRound.value)
  }
  return fixtures.value.filter(f => f.round === currentRound.value)
})

const currentWeekFinals = computed(() => {
  if (!finalsActive.value) return []
  const week = currentRound.value - FINALS_START_ROUND + 1
  return finalsFixtures.value.filter(f => f.week === week)
})

const nextMatch = computed(() => {
  return fixtures.value.find(f =>
    !f.played &&
    (f.homeTeam === teamName.value || f.awayTeam === teamName.value)
  )
})

const ourNextMatch = computed(() => {
  return currentRoundFixtures.value.find(f =>
    f.homeTeam === teamName.value || f.awayTeam === teamName.value
  )
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

  const ourScore = currentMatch.value.isHome ? homeScore.value : awayScore.value
  const theirScore = currentMatch.value.isHome ? awayScore.value : homeScore.value
  const isFinalsMatch = currentMatch.value.round >= FINALS_START_ROUND

  // Update ladder (only for regular season)
  if (!isFinalsMatch) {
    const ourTeam = standings.value.find(t => t.team === teamName.value)
    const opponentTeam = standings.value.find(t => t.team === currentMatch.value.opponent)

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
    } else if (ourScore < theirScore) {
      ourTeam.lost++
      opponentTeam.won++
      opponentTeam.points += 4
    } else {
      ourTeam.drawn++
      ourTeam.points += 2
      opponentTeam.drawn++
      opponentTeam.points += 2
    }

    // Calculate percentages
    ourTeam.percentage = ourTeam.pa > 0 ? (ourTeam.pf / ourTeam.pa * 100).toFixed(2) : 100
    opponentTeam.percentage = opponentTeam.pa > 0 ? (opponentTeam.pf / opponentTeam.pa * 100).toFixed(2) : 100
  }

  // Display result
  if (ourScore > theirScore) {
    const msg = isFinalsMatch
      ? `🏆 FINALS VICTORY! Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) def. ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
      : `🏆 VICTORY! Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) def. ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
    currentMatch.value.events.unshift({
      type: 'result',
      message: msg
    })
  } else if (ourScore < theirScore) {
    const msg = isFinalsMatch
      ? `😞 Finals Defeat. Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) lost to ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
      : `😞 Defeat. Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) lost to ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
    currentMatch.value.events.unshift({
      type: 'result',
      message: msg
    })
  } else {
    currentMatch.value.events.unshift({
      type: 'result',
      message: `🤝 Draw! Final Score: ${currentMatch.value.homeTeam} ${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value}) drew with ${currentMatch.value.awayTeam} ${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`
    })
  }

  // Mark fixture as played
  if (currentMatch.value.fixture) {
    currentMatch.value.fixture.played = true
    currentMatch.value.fixture.homeScore = `${currentMatch.value.homeGoals}.${currentMatch.value.homeBehinds} (${homeScore.value})`
    currentMatch.value.fixture.awayScore = `${currentMatch.value.awayGoals}.${currentMatch.value.awayBehinds} (${awayScore.value})`

    // For finals, set winner and loser
    if (isFinalsMatch) {
      if (homeScore.value > awayScore.value) {
        currentMatch.value.fixture.winner = currentMatch.value.homeTeam
        currentMatch.value.fixture.loser = currentMatch.value.awayTeam
      } else {
        currentMatch.value.fixture.winner = currentMatch.value.awayTeam
        currentMatch.value.fixture.loser = currentMatch.value.homeTeam
      }

      // Check for Grand Final
      if (currentMatch.value.fixture.grandFinal) {
        premiersTeam.value = currentMatch.value.fixture.winner
      }

      // Update finals bracket
      updateFinalsMatchups()
    }
  }

  // Toggle home/away for next match
  currentMatch.value.isHome = !currentMatch.value.isHome
}

const healAllPlayers = () => {
  squad.value.forEach(player => {
    player.injured = false
  })
}

// Quick match simulation (for CPU vs CPU)
const simulateQuickMatch = (fixture) => {
  const homeGoals = Math.floor(Math.random() * 10) + 8  // 8-17 goals
  const homeBehinds = Math.floor(Math.random() * 12) + 4 // 4-15 behinds
  const awayGoals = Math.floor(Math.random() * 10) + 8
  const awayBehinds = Math.floor(Math.random() * 12) + 4

  const homeScore = homeGoals * 6 + homeBehinds
  const awayScore = awayGoals * 6 + awayBehinds

  fixture.homeScore = `${homeGoals}.${homeBehinds} (${homeScore})`
  fixture.awayScore = `${awayGoals}.${awayBehinds} (${awayScore})`
  fixture.played = true

  // Update ladder (only for regular season)
  const homeTeam = standings.value.find(t => t.team === fixture.homeTeam)
  const awayTeam = standings.value.find(t => t.team === fixture.awayTeam)

  homeTeam.played++
  awayTeam.played++
  homeTeam.pf += homeScore
  homeTeam.pa += awayScore
  awayTeam.pf += awayScore
  awayTeam.pa += homeScore

  if (homeScore > awayScore) {
    homeTeam.won++
    homeTeam.points += 4
    awayTeam.lost++
  } else if (awayScore > homeScore) {
    awayTeam.won++
    awayTeam.points += 4
    homeTeam.lost++
  } else {
    homeTeam.drawn++
    awayTeam.drawn++
    homeTeam.points += 2
    awayTeam.points += 2
  }

  homeTeam.percentage = homeTeam.pa > 0 ? (homeTeam.pf / homeTeam.pa * 100).toFixed(2) : 100
  awayTeam.percentage = awayTeam.pa > 0 ? (awayTeam.pf / awayTeam.pa * 100).toFixed(2) : 100
}

// Simulate finals match
const simulateFinalsMatch = (fixture) => {
  if (!fixture.homeTeam || !fixture.awayTeam) {
    console.log('Cannot simulate match - teams not set yet')
    return
  }

  let homeGoals = Math.floor(Math.random() * 10) + 8
  let homeBehinds = Math.floor(Math.random() * 12) + 4
  let awayGoals = Math.floor(Math.random() * 10) + 8
  let awayBehinds = Math.floor(Math.random() * 12) + 4

  let homeScore = homeGoals * 6 + homeBehinds
  let awayScore = awayGoals * 6 + awayBehinds

  // No draws in finals - keep generating until we have a winner
  while (homeScore === awayScore) {
    homeGoals = Math.floor(Math.random() * 10) + 8
    homeBehinds = Math.floor(Math.random() * 12) + 4
    awayGoals = Math.floor(Math.random() * 10) + 8
    awayBehinds = Math.floor(Math.random() * 12) + 4
    homeScore = homeGoals * 6 + homeBehinds
    awayScore = awayGoals * 6 + awayBehinds
  }

  fixture.homeScore = `${homeGoals}.${homeBehinds} (${homeScore})`
  fixture.awayScore = `${awayGoals}.${awayBehinds} (${awayScore})`
  fixture.played = true

  // Set winner and loser
  if (homeScore > awayScore) {
    fixture.winner = fixture.homeTeam
    fixture.loser = fixture.awayTeam
  } else {
    fixture.winner = fixture.awayTeam
    fixture.loser = fixture.homeTeam
  }

  // Check for Grand Final
  if (fixture.grandFinal) {
    premiersTeam.value = fixture.winner
  }

  // Update finals bracket
  updateFinalsMatchups()
}

// Simulate entire round (all CPU vs CPU matches)
const simulateRound = () => {
  // Check if we need to generate finals
  if (currentRound.value === 23 && !finalsActive.value) {
    // Check if all round 23 matches are played
    const allRound23Played = fixtures.value
      .filter(f => f.round === 23)
      .every(f => f.played)

    if (allRound23Played) {
      generateFinals()
      currentRound.value = FINALS_START_ROUND
      return
    }
  }

  const roundFixtures = currentRoundFixtures.value
  const isFinalsRound = currentRound.value >= FINALS_START_ROUND

  roundFixtures.forEach(fixture => {
    // Skip our team's matches and already played matches
    if (fixture.played) return
    if (fixture.homeTeam === teamName.value || fixture.awayTeam === teamName.value) return

    // Simulate the match
    if (isFinalsRound) {
      simulateFinalsMatch(fixture)
    } else {
      simulateQuickMatch(fixture)
    }
  })

  // Check if our match is done, if so advance round
  const ourMatch = ourNextMatch.value
  if (!ourMatch || ourMatch.played) {
    if (currentRound.value < MAX_ROUNDS) {
      currentRound.value++
    }
  }
}

// Play our next match from calendar
const playNextMatch = () => {
  const match = ourNextMatch.value
  if (!match) return

  const isHome = match.homeTeam === teamName.value
  const opponent = isHome ? match.awayTeam : match.homeTeam

  currentMatch.value = {
    active: true,
    paused: false,
    opponent,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: 0,
    homeBehinds: 0,
    awayGoals: 0,
    awayBehinds: 0,
    quarter: 1,
    timeInQuarter: 0,
    events: [],
    isHome,
    quarterBreak: false,
    round: currentRound.value,
    fixture: match
  }

  activeTab.value = 'match'
  simulateMatch()
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

  // Reset season
  currentRound.value = 1
  generateFixtures()

  // Reset finals
  finalsActive.value = false
  finalsFixtures.value = []
  premiersTeam.value = null

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
    quarterBreak: false,
    round: 1
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
        @click="activeTab = 'calendar'"
        :class="{ active: activeTab === 'calendar' }">
        📅 Calendar
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
        v-if="finalsActive || premiersTeam"
        @click="activeTab = 'finals'"
        :class="{ active: activeTab === 'finals' }">
        🏆 Finals
      </button>
      <button
        @click="activeTab = 'squad'"
        :class="{ active: activeTab === 'squad' }">
        Squad
      </button>
      <button
        @click="activeTab = 'stats'"
        :class="{ active: activeTab === 'stats' }">
        Statistics
      </button>
    </nav>

    <!-- Calendar Tab -->
    <div v-if="activeTab === 'calendar'" class="tab-content">
      <div class="season-header">
        <h2>Season {{ seasonYear }} - Round {{ currentRound }} of {{ MAX_ROUNDS }}</h2>
        <div class="calendar-controls">
          <button @click="simulateRound" class="action-btn">⚡ Simulate Other Matches</button>
          <button v-if="ourNextMatch" @click="playNextMatch" class="action-btn primary">▶️ Play Next Match</button>
        </div>
      </div>

      <div v-if="ourNextMatch" class="next-match-card">
        <h3>🏈 YOUR NEXT MATCH</h3>
        <div class="next-match-details">
          <div class="team-badge">
            <strong>{{ ourNextMatch.homeTeam }}</strong>
            <span class="venue-tag">{{ ourNextMatch.homeTeam === teamName ? 'HOME' : 'AWAY' }}</span>
          </div>
          <div class="vs">VS</div>
          <div class="team-badge">
            <strong>{{ ourNextMatch.awayTeam }}</strong>
            <span class="venue-tag">{{ ourNextMatch.awayTeam === teamName ? 'HOME' : 'AWAY' }}</span>
          </div>
        </div>
      </div>

      <div class="round-fixtures">
        <h3>Round {{ currentRound }} Fixtures</h3>
        <div class="fixtures-grid">
          <div
            v-for="(fixture, index) in currentRoundFixtures"
            :key="index"
            class="fixture-card"
            :class="{
              'our-match': fixture.homeTeam === teamName || fixture.awayTeam === teamName,
              'played': fixture.played
            }">
            <div class="fixture-teams">
              <div class="fixture-team home">
                <span class="team-name">{{ fixture.homeTeam }}</span>
                <span v-if="fixture.played" class="team-score">{{ fixture.homeScore }}</span>
              </div>
              <div class="fixture-vs">{{ fixture.played ? 'def' : 'vs' }}</div>
              <div class="fixture-team away">
                <span class="team-name">{{ fixture.awayTeam }}</span>
                <span v-if="fixture.played" class="team-score">{{ fixture.awayScore }}</span>
              </div>
            </div>
            <div v-if="!fixture.played" class="fixture-status">Not Played</div>
            <div v-else class="fixture-status completed">✓ Completed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Finals Tab -->
    <div v-if="activeTab === 'finals'" class="tab-content">
      <div class="finals-header">
        <h2>🏆 AFL Finals Series {{ seasonYear }}</h2>
        <p v-if="!premiersTeam" class="finals-subtitle">Road to the Premiership</p>
        <div v-else class="premiers-banner">
          <h1>🎉 {{ premiersTeam }} 🎉</h1>
          <p class="premiers-title">{{ seasonYear }} PREMIERS!</p>
        </div>
      </div>

      <div class="finals-bracket">
        <!-- Week 1 - Qualifying & Elimination Finals -->
        <div class="finals-week">
          <h3 class="week-title">Week 1 - Finals</h3>
          <div class="finals-matches">
            <div
              v-for="(match, idx) in finalsFixtures.filter(f => f.week === 1)"
              :key="idx"
              class="finals-match-card"
              :class="{
                'played': match.played,
                'our-match': match.homeTeam === teamName || match.awayTeam === teamName,
                'elimination': match.elimination
              }">
              <div class="match-title">{{ match.matchType }}</div>
              <div class="finals-teams">
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.homeTeam }">
                  <span class="team-name">{{ match.homeTeam }}</span>
                  <span v-if="match.played" class="team-score">{{ match.homeScore }}</span>
                  <span v-if="match.played && match.winner === match.homeTeam" class="winner-badge">✓</span>
                </div>
                <div class="vs-divider">VS</div>
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.awayTeam }">
                  <span class="team-name">{{ match.awayTeam }}</span>
                  <span v-if="match.played" class="team-score">{{ match.awayScore }}</span>
                  <span v-if="match.played && match.winner === match.awayTeam" class="winner-badge">✓</span>
                </div>
              </div>
              <div v-if="!match.played && match.homeTeam && match.awayTeam" class="match-status pending">Upcoming</div>
              <div v-if="match.played" class="match-status completed">Completed</div>
              <div v-if="match.elimination && match.played" class="elimination-note">{{ match.loser }} eliminated</div>
            </div>
          </div>
        </div>

        <!-- Week 2 - Semi Finals -->
        <div v-if="finalsFixtures.filter(f => f.week === 2 && (f.homeTeam || f.played)).length > 0" class="finals-week">
          <h3 class="week-title">Week 2 - Semi Finals</h3>
          <div class="finals-matches">
            <div
              v-for="(match, idx) in finalsFixtures.filter(f => f.week === 2)"
              :key="idx"
              v-show="match.homeTeam || match.played"
              class="finals-match-card"
              :class="{
                'played': match.played,
                'our-match': match.homeTeam === teamName || match.awayTeam === teamName
              }">
              <div class="match-title">{{ match.matchType }}</div>
              <div class="finals-teams">
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.homeTeam }">
                  <span class="team-name">{{ match.homeTeam || 'TBD' }}</span>
                  <span v-if="match.played" class="team-score">{{ match.homeScore }}</span>
                  <span v-if="match.played && match.winner === match.homeTeam" class="winner-badge">✓</span>
                </div>
                <div class="vs-divider">VS</div>
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.awayTeam }">
                  <span class="team-name">{{ match.awayTeam || 'TBD' }}</span>
                  <span v-if="match.played" class="team-score">{{ match.awayScore }}</span>
                  <span v-if="match.played && match.winner === match.awayTeam" class="winner-badge">✓</span>
                </div>
              </div>
              <div v-if="!match.played && match.homeTeam && match.awayTeam" class="match-status pending">Upcoming</div>
              <div v-if="match.played" class="match-status completed">Completed</div>
              <div v-if="match.played" class="elimination-note">{{ match.loser }} eliminated</div>
            </div>
          </div>
        </div>

        <!-- Week 3 - Preliminary Finals -->
        <div v-if="finalsFixtures.filter(f => f.week === 3 && (f.homeTeam || f.played)).length > 0" class="finals-week">
          <h3 class="week-title">Week 3 - Preliminary Finals</h3>
          <div class="finals-matches">
            <div
              v-for="(match, idx) in finalsFixtures.filter(f => f.week === 3)"
              :key="idx"
              v-show="match.homeTeam || match.played"
              class="finals-match-card"
              :class="{
                'played': match.played,
                'our-match': match.homeTeam === teamName || match.awayTeam === teamName
              }">
              <div class="match-title">{{ match.matchType }}</div>
              <div class="finals-teams">
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.homeTeam }">
                  <span class="team-name">{{ match.homeTeam || 'TBD' }}</span>
                  <span v-if="match.played" class="team-score">{{ match.homeScore }}</span>
                  <span v-if="match.played && match.winner === match.homeTeam" class="winner-badge">✓</span>
                </div>
                <div class="vs-divider">VS</div>
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.awayTeam }">
                  <span class="team-name">{{ match.awayTeam || 'TBD' }}</span>
                  <span v-if="match.played" class="team-score">{{ match.awayScore }}</span>
                  <span v-if="match.played && match.winner === match.awayTeam" class="winner-badge">✓</span>
                </div>
              </div>
              <div v-if="!match.played && match.homeTeam && match.awayTeam" class="match-status pending">Upcoming</div>
              <div v-if="match.played" class="match-status completed">Completed</div>
              <div v-if="match.played" class="elimination-note">{{ match.loser }} eliminated</div>
            </div>
          </div>
        </div>

        <!-- Week 4 - Grand Final -->
        <div v-if="finalsFixtures.filter(f => f.week === 4 && (f.homeTeam || f.played)).length > 0" class="finals-week grand-final-week">
          <h3 class="week-title grand-final-title">🏆 Week 4 - GRAND FINAL 🏆</h3>
          <div class="finals-matches">
            <div
              v-for="(match, idx) in finalsFixtures.filter(f => f.week === 4)"
              :key="idx"
              v-show="match.homeTeam || match.played"
              class="finals-match-card grand-final-card"
              :class="{
                'played': match.played,
                'our-match': match.homeTeam === teamName || match.awayTeam === teamName
              }">
              <div class="match-title grand-final-label">GRAND FINAL</div>
              <div class="finals-teams">
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.homeTeam }">
                  <span class="team-name">{{ match.homeTeam || 'TBD' }}</span>
                  <span v-if="match.played" class="team-score">{{ match.homeScore }}</span>
                  <span v-if="match.played && match.winner === match.homeTeam" class="winner-badge">👑</span>
                </div>
                <div class="vs-divider">VS</div>
                <div class="finals-team" :class="{ winner: match.played && match.winner === match.awayTeam }">
                  <span class="team-name">{{ match.awayTeam || 'TBD' }}</span>
                  <span v-if="match.played" class="team-score">{{ match.awayScore }}</span>
                  <span v-if="match.played && match.winner === match.awayTeam" class="winner-badge">👑</span>
                </div>
              </div>
              <div v-if="!match.played && match.homeTeam && match.awayTeam" class="match-status pending grand-final-pending">Upcoming</div>
              <div v-if="match.played" class="match-status completed">{{ match.winner }} - PREMIERS!</div>
            </div>
          </div>
        </div>
      </div>
    </div>

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

/* Calendar Styles */
.season-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.season-header h2 {
  margin: 0 0 1.5rem 0;
  color: #d72317;
  font-size: 1.8rem;
}

.calendar-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn.primary {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 50%, #4caf50 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}

.next-match-card {
  background: linear-gradient(135deg, #d72317 0%, #8b1810 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 35px rgba(215, 35, 23, 0.3);
  animation: fadeIn 0.5s;
}

.next-match-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 2px;
}

.next-match-details {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
  flex-wrap: wrap;
}

.team-badge {
  flex: 1;
  min-width: 200px;
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.team-badge strong {
  display: block;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.venue-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.vs {
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.round-fixtures {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.round-fixtures h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.fixtures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.fixture-card {
  background: #f9f9f9;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s;
}

.fixture-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.fixture-card.our-match {
  background: linear-gradient(135deg, #fff3e0 0%, #fff 100%);
  border-color: #ff9800;
  border-width: 3px;
}

.fixture-card.played {
  opacity: 0.8;
}

.fixture-teams {
  margin-bottom: 1rem;
}

.fixture-team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.fixture-team.home {
  border-bottom: 1px solid #e0e0e0;
}

.team-name {
  font-weight: 600;
  color: #333;
}

.team-score {
  font-weight: 700;
  color: #d72317;
  font-size: 1.1rem;
}

.fixture-vs {
  text-align: center;
  font-weight: 600;
  color: #999;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.fixture-status {
  text-align: center;
  padding: 0.5rem;
  background: #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}

.fixture-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

/* Finals Styles */
.finals-header {
  background: linear-gradient(135deg, #d72317 0%, #8b1810 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(215, 35, 23, 0.4);
}

.finals-header h2 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.finals-subtitle {
  margin: 1rem 0 0 0;
  font-size: 1.2rem;
  opacity: 0.95;
  font-style: italic;
}

.premiers-banner {
  margin-top: 1rem;
  padding: 2rem;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  border: 3px solid #ffd700;
  animation: pulse 2s ease-in-out infinite;
}

.premiers-banner h1 {
  margin: 0;
  font-size: 3rem;
  font-weight: 900;
  color: #ffd700;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  animation: shimmer 3s infinite;
}

.premiers-title {
  margin: 0.5rem 0 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  letter-spacing: 3px;
}

.finals-bracket {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.finals-week {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.finals-week.grand-final-week {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border: 3px solid #ffd700;
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.3);
}

.week-title {
  margin: 0 0 1.5rem 0;
  color: #d72317;
  font-size: 1.8rem;
  font-weight: 700;
  border-bottom: 3px solid #d72317;
  padding-bottom: 0.5rem;
}

.week-title.grand-final-title {
  color: #ffd700;
  border-bottom-color: #ffd700;
  font-size: 2rem;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.finals-matches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.finals-match-card {
  background: #f9f9f9;
  border: 3px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.finals-match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.finals-match-card.our-match {
  background: linear-gradient(135deg, #fff3e0 0%, #fff 100%);
  border-color: #ff9800;
  border-width: 4px;
}

.finals-match-card.played {
  opacity: 0.95;
}

.finals-match-card.grand-final-card {
  background: linear-gradient(135deg, #fffef5 0%, #fff 100%);
  border-color: #ffd700;
  border-width: 4px;
  box-shadow: 0 6px 25px rgba(255, 215, 0, 0.3);
}

.match-title {
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #d72317;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e8e8e8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.match-title.grand-final-label {
  font-size: 1.3rem;
  color: #ffd700;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  border-bottom-color: #ffd700;
}

.finals-teams {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.finals-team {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s;
}

.finals-team.winner {
  background: linear-gradient(90deg, #e8f5e9 0%, #fff 100%);
  border-color: #4caf50;
  border-width: 3px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
}

.finals-team .team-name {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.finals-team .team-score {
  font-weight: 700;
  color: #d72317;
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.finals-team .winner-badge {
  font-size: 1.5rem;
  animation: scoreAppear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.vs-divider {
  text-align: center;
  font-weight: 700;
  color: #999;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.match-status {
  text-align: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.match-status.pending {
  background: #e3f2fd;
  color: #1976d2;
}

.match-status.grand-final-pending {
  background: #fff9e6;
  color: #f57c00;
  border: 2px solid #ffd700;
}

.match-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.elimination-note {
  text-align: center;
  padding: 0.5rem;
  margin-top: 0.5rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #ffcdd2;
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

  .fixtures-grid {
    grid-template-columns: 1fr;
  }

  .calendar-controls {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .next-match-details {
    flex-direction: column;
  }

  .team-badge {
    min-width: 100%;
  }

  .vs {
    font-size: 1.8rem;
  }

  .finals-matches {
    grid-template-columns: 1fr;
  }

  .finals-header h2 {
    font-size: 1.8rem;
  }

  .premiers-banner h1 {
    font-size: 2rem;
  }

  .week-title {
    font-size: 1.4rem;
  }
}
</style>
