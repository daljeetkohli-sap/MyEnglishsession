import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'

const STORAGE_KEY = 'aussieEnglishGameProgressV1'

const vocabulary = [
  {
    id: 'arvo',
    word: 'arvo',
    meaning: 'afternoon',
    example: 'I will finish the task this arvo.',
    task: 'Use "arvo" when planning one thing you will do after lunch.',
    category: 'Daily planning',
  },
  {
    id: 'brekkie',
    word: 'brekkie',
    meaning: 'breakfast',
    example: 'I had toast for brekkie before work.',
    task: 'Say what you had for brekkie in one full sentence.',
    category: 'Home',
  },
  {
    id: 'no-worries',
    word: 'no worries',
    meaning: 'that is okay',
    example: 'No worries, I can send it again.',
    task: 'Reply to a small apology using "no worries".',
    category: 'Social',
  },
  {
    id: 'reckon',
    word: 'reckon',
    meaning: 'think or believe',
    example: 'I reckon we should leave at eight.',
    task: 'Give your opinion about today using "I reckon...".',
    category: 'Opinion',
  },
  {
    id: 'keen',
    word: 'keen',
    meaning: 'interested or excited',
    example: 'I am keen to try that cafe.',
    task: 'Name one thing you are keen to improve this week.',
    category: 'Goals',
  },
  {
    id: 'cuppa',
    word: 'cuppa',
    meaning: 'cup of tea or coffee',
    example: 'Would you like a cuppa before the meeting?',
    task: 'Offer someone a cuppa in a polite sentence.',
    category: 'Hospitality',
  },
  {
    id: 'servo',
    word: 'servo',
    meaning: 'service station',
    example: 'I need to stop at the servo for fuel.',
    task: 'Describe one thing you might buy at a servo.',
    category: 'Errands',
  },
  {
    id: 'heaps',
    word: 'heaps',
    meaning: 'a lot',
    example: 'Thanks heaps for your help.',
    task: 'Thank someone using "heaps".',
    category: 'Work',
  },
  {
    id: 'mate',
    word: 'mate',
    meaning: 'friend or friendly address',
    example: 'Good on you, mate.',
    task: 'Write a friendly greeting that includes "mate".',
    category: 'Social',
  },
  {
    id: 'chuck-a-u-ey',
    word: 'chuck a U-ey',
    meaning: 'make a U-turn',
    example: 'We missed the turn, so chuck a U-ey when safe.',
    task: 'Give a simple driving direction using "chuck a U-ey".',
    category: 'Travel',
  },
  {
    id: 'dodgy',
    word: 'dodgy',
    meaning: 'unreliable or suspicious',
    example: 'That link looks dodgy, so do not click it.',
    task: 'Describe something unsafe online using "dodgy".',
    category: 'Safety',
  },
  {
    id: 'good-on-ya',
    word: 'good on ya',
    meaning: 'well done',
    example: 'Good on ya for finishing the course.',
    task: 'Praise someone for completing a task.',
    category: 'Encouragement',
  },
]

const scenarios = [
  {
    title: 'Coffee Counter',
    prompt: 'Ask for a takeaway coffee and thank the barista.',
    starters: ['Could I please grab...', 'Thanks heaps...', 'No worries...'],
  },
  {
    title: 'Work Check-in',
    prompt: 'Tell a teammate what you will finish this afternoon.',
    starters: ['I reckon...', 'This arvo I will...', 'I am keen to...'],
  },
  {
    title: 'Weekend Plan',
    prompt: 'Invite someone to do one simple weekend activity.',
    starters: ['Are you keen to...', 'We could grab a cuppa...', 'No worries if...'],
  },
]

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    return JSON.parse(saved)
  } catch {
    return null
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getDailySet() {
  const daySeed = Math.floor(Date.now() / 86400000)
  return [0, 1, 2].map((offset) => vocabulary[(daySeed + offset * 3) % vocabulary.length])
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
}

function Icon({ type }) {
  const paths = {
    bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
    book: 'M4 5.5A3.5 3.5 0 0 1 7.5 2H20v16H7.5A3.5 3.5 0 0 0 4 21.5v-16Z M4 5.5A3.5 3.5 0 0 1 7.5 9H20',
    check: 'm4 12 5 5L20 6',
    target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    wifi: 'M5 13a10 10 0 0 1 14 0 M8.5 16.5a5 5 0 0 1 7 0 M12 20h.01',
    spark: 'M12 2l1.7 6.2L20 10l-6.3 1.8L12 18l-1.7-6.2L4 10l6.3-1.8L12 2Z',
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={paths[type]} />
    </svg>
  )
}

export default function App() {
  const todayKey = getTodayKey()
  const dailySet = useMemo(getDailySet, [])
  const initial = loadProgress()
  const [points, setPoints] = useState(initial?.points ?? 0)
  const [completed, setCompleted] = useState(initial?.completed ?? {})
  const [selectedWord, setSelectedWord] = useState(dailySet[0].id)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('Pick a meaning and lock in the word.')
  const [scenarioIndex, setScenarioIndex] = useState(initial?.scenarioIndex ?? 0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const selected = vocabulary.find((item) => item.id === selectedWord) ?? dailySet[0]
  const todayDone = completed[todayKey] ?? []
  const dailyDoneCount = dailySet.filter((item) => todayDone.includes(item.id)).length
  const level = Math.floor(points / 80) + 1
  const levelProgress = points % 80
  const currentScenario = scenarios[scenarioIndex % scenarios.length]
  const shuffledMeanings = useMemo(
    () => [...dailySet].sort((a, b) => a.meaning.localeCompare(b.meaning)),
    [dailySet],
  )

  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  useEffect(() => {
    const progress = { points, completed, scenarioIndex }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [points, completed, scenarioIndex])

  function completeDailyTask(id) {
    const alreadyDone = todayDone.includes(id)
    const nextForToday = alreadyDone ? todayDone : [...todayDone, id]
    setCompleted({ ...completed, [todayKey]: nextForToday })
    if (!alreadyDone) setPoints(points + 25)
  }

  function checkAnswer(meaning) {
    if (meaning === selected.meaning) {
      setFeedback(`Correct: "${selected.word}" means ${selected.meaning}.`)
      completeDailyTask(selected.id)
      return
    }
    setFeedback(`Close. Try "${selected.example}" and choose again.`)
  }

  function savePractice() {
    if (normalize(answer).length < 8) {
      setFeedback('Write one complete practice sentence first.')
      return
    }
    setPoints(points + 10)
    setAnswer('')
    setScenarioIndex(scenarioIndex + 1)
    setFeedback('Nice sentence. New scene unlocked.')
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="app-title">
        <div className="hero-copy">
          <div className="status-pill">
            <Icon type={isOnline ? 'wifi' : 'check'} />
            {isOnline ? 'Online ready' : 'Offline mode'}
          </div>
          <h1 id="app-title">Aussie English Daily Quest</h1>
          <p>
            Build useful vocabulary through tiny daily missions, quick games, and real-life
            speaking prompts that work without internet.
          </p>
          <div className="hero-actions" aria-label="Progress summary">
            <div>
              <strong>{points}</strong>
              <span>points</span>
            </div>
            <div>
              <strong>{level}</strong>
              <span>level</span>
            </div>
            <div>
              <strong>{dailyDoneCount}/3</strong>
              <span>today</span>
            </div>
          </div>
        </div>
        <div className="quest-orbit" aria-hidden="true">
          <div className="orbit-card active">
            <span>Word</span>
            <b>{selected.word}</b>
          </div>
          <div className="orbit-card">
            <span>Task</span>
            <b>Speak</b>
          </div>
          <div className="orbit-card">
            <span>Win</span>
            <b>XP</b>
          </div>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="Learning dashboard">
        <article className="panel lesson-panel">
          <div className="panel-heading">
            <span className="section-mark">
              <Icon type="book" />
            </span>
            <div>
              <p>Today&apos;s words</p>
              <h2>Daily quest</h2>
            </div>
          </div>
          <div className="word-list">
            {dailySet.map((item) => (
              <button
                key={item.id}
                className={`word-button ${selectedWord === item.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedWord(item.id)
                  setFeedback('Pick a meaning and lock in the word.')
                }}
                type="button"
              >
                <span>{item.category}</span>
                <strong>{item.word}</strong>
                {todayDone.includes(item.id) && <Icon type="check" />}
              </button>
            ))}
          </div>
        </article>

        <article className="panel game-panel">
          <div className="panel-heading">
            <span className="section-mark">
              <Icon type="target" />
            </span>
            <div>
              <p>Mini game</p>
              <h2>Meaning match</h2>
            </div>
          </div>
          <div className="focus-word">
            <span>Match this word</span>
            <strong>{selected.word}</strong>
            <p>{selected.example}</p>
          </div>
          <div className="meaning-grid">
            {shuffledMeanings.map((item) => (
              <button key={item.id} type="button" onClick={() => checkAnswer(item.meaning)}>
                {item.meaning}
              </button>
            ))}
          </div>
          <p className="feedback" role="status">
            {feedback}
          </p>
        </article>

        <article className="panel task-panel">
          <div className="panel-heading">
            <span className="section-mark">
              <Icon type="bolt" />
            </span>
            <div>
              <p>Real-life task</p>
              <h2>{currentScenario.title}</h2>
            </div>
          </div>
          <p className="scenario-prompt">{currentScenario.prompt}</p>
          <div className="starter-row" aria-label="Sentence starters">
            {currentScenario.starters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => setAnswer(`${starter} `)}
                title={`Use "${starter}"`}
              >
                {starter}
              </button>
            ))}
          </div>
          <label className="practice-box">
            <span>Your sentence</span>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type or speak your sentence here..."
              rows="4"
            />
          </label>
          <button className="primary-action" type="button" onClick={savePractice}>
            <Icon type="spark" />
            Complete task
          </button>
        </article>

        <article className="panel progress-panel">
          <div className="panel-heading">
            <span className="section-mark">
              <Icon type="spark" />
            </span>
            <div>
              <p>Progress</p>
              <h2>Level {level}</h2>
            </div>
          </div>
          <div className="level-meter" aria-label={`${levelProgress} of 80 points to next level`}>
            <span style={{ width: `${(levelProgress / 80) * 100}%` }} />
          </div>
          <div className="stat-stack">
            <div>
              <span>Offline-first</span>
              <strong>Cached app shell</strong>
            </div>
            <div>
              <span>Data use</span>
              <strong>Local content only</strong>
            </div>
            <div>
              <span>Daily rhythm</span>
              <strong>3 short wins</strong>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
