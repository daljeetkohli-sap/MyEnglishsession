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

const sourceOptions = [
  { id: 'daily', label: 'Daily mix' },
  { id: 'work', label: 'Work' },
  { id: 'social', label: 'Social' },
  { id: 'errands', label: 'Errands' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'custom', label: 'Custom focus' },
]

const sourceCategories = {
  work: ['Work', 'Daily planning', 'Goals', 'Opinion'],
  social: ['Social', 'Hospitality', 'Encouragement'],
  errands: ['Errands', 'Travel', 'Safety'],
  confidence: ['Goals', 'Opinion', 'Encouragement', 'Work'],
}

const sourceScenarios = {
  daily: scenarios,
  work: [
    {
      title: 'Team Update',
      prompt: 'Tell a teammate what you are working on and when you will finish.',
      starters: ['I reckon...', 'This arvo I will...', 'Thanks heaps for...'],
    },
    {
      title: 'Quick Follow-up',
      prompt: 'Ask for a missing detail in a friendly workplace message.',
      starters: ['Could you please...', 'No worries if...', 'I am keen to...'],
    },
  ],
  social: [
    {
      title: 'Friendly Chat',
      prompt: 'Greet someone and ask one natural follow-up question.',
      starters: ['Hey mate...', 'Are you keen to...', 'Good on ya for...'],
    },
    {
      title: 'Small Apology',
      prompt: 'Respond kindly when someone says sorry for being late.',
      starters: ['No worries...', 'All good...', 'Thanks heaps for...'],
    },
  ],
  errands: [
    {
      title: 'Out and About',
      prompt: 'Explain one quick errand you need to do today.',
      starters: ['I need to stop at...', 'I reckon the servo...', 'This looks dodgy...'],
    },
    {
      title: 'Simple Direction',
      prompt: 'Give one clear travel direction using everyday language.',
      starters: ['Chuck a U-ey...', 'Head past the...', 'No worries, we can...'],
    },
  ],
  confidence: [
    {
      title: 'Personal Goal',
      prompt: 'Say one thing you are keen to improve this week.',
      starters: ['I am keen to...', 'I reckon I can...', 'Good on ya for...'],
    },
    {
      title: 'Positive Reply',
      prompt: 'Encourage someone who completed a hard task.',
      starters: ['Good on ya...', 'Thanks heaps for...', 'I reckon you...'],
    },
  ],
  custom: [
    {
      title: 'Custom Practice',
      prompt: 'Use your custom focus words in one useful sentence for today.',
      starters: ['Today I will use...', 'I reckon...', 'I am keen to...'],
    },
  ],
}

const walkthroughSteps = [
  {
    title: 'Choose your focus',
    body: 'Use the input selectors to decide what drives each section: daily words, work, social, errands, confidence, or your custom focus.',
  },
  {
    title: 'Pick a word',
    body: 'Start in Daily Quest. Tap a word you want to practise, then use it as your anchor for the game.',
  },
  {
    title: 'Play the match',
    body: 'In Meaning Match, choose the meaning that fits the active word. Correct answers add progress for today.',
  },
  {
    title: 'Write one real sentence',
    body: 'Use the sentence starters in Real-life Task, type one useful sentence, then complete the task to unlock the next scene.',
  },
  {
    title: 'Check progress',
    body: 'Watch points, level, and active source words. Everything saves on this device and keeps working offline.',
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

function makeCustomWords(customFocus) {
  return customFocus
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((word, index) => ({
      id: `custom-${normalize(word) || index}`,
      word,
      meaning: `your custom focus ${index + 1}`,
      example: `Practise "${word}" in a sentence you can use today.`,
      task: `Use "${word}" in one useful sentence.`,
      category: 'Custom',
    }))
}

function getWordsForSource(sourceId, dailyWords, customFocus) {
  if (sourceId === 'daily') return dailyWords

  if (sourceId === 'custom') {
    const customWords = makeCustomWords(customFocus)
    return customWords.length ? customWords : dailyWords
  }

  const categories = sourceCategories[sourceId] ?? []
  const sourceWords = vocabulary.filter((item) => categories.includes(item.category))
  return sourceWords.length >= 3 ? sourceWords.slice(0, 3) : dailyWords
}

function getScenarioForSource(sourceId, scenarioIndex) {
  const sourceSet = sourceScenarios[sourceId] ?? scenarios
  return sourceSet[scenarioIndex % sourceSet.length]
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
}

function SourceControl({ id, label, value, customFocus, onSourceChange, onCustomFocusChange }) {
  return (
    <div className="source-control">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onSourceChange(event.target.value)}>
        {sourceOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {value === 'custom' && (
        <input
          type="text"
          value={customFocus}
          onChange={(event) => onCustomFocusChange(event.target.value)}
          placeholder="e.g. meeting, shopping, phone call"
        />
      )}
    </div>
  )
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
  const initial = loadProgress()
  const baseDailySet = useMemo(getDailySet, [])
  const [points, setPoints] = useState(initial?.points ?? 0)
  const [completed, setCompleted] = useState(initial?.completed ?? {})
  const [sectionInputs, setSectionInputs] = useState(
    initial?.sectionInputs ?? {
      quest: 'daily',
      game: 'daily',
      task: 'daily',
      progress: 'daily',
    },
  )
  const [customFocus, setCustomFocus] = useState(
    initial?.customFocus ?? 'meeting, shopping, phone call',
  )
  const questWords = useMemo(
    () => getWordsForSource(sectionInputs.quest, baseDailySet, customFocus),
    [baseDailySet, customFocus, sectionInputs.quest],
  )
  const gameWords = useMemo(
    () => getWordsForSource(sectionInputs.game, baseDailySet, customFocus),
    [baseDailySet, customFocus, sectionInputs.game],
  )
  const [selectedWord, setSelectedWord] = useState(questWords[0].id)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('Pick a meaning and lock in the word.')
  const [scenarioIndex, setScenarioIndex] = useState(initial?.scenarioIndex ?? 0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showWalkthrough, setShowWalkthrough] = useState(initial?.showWalkthrough ?? true)
  const [walkthroughStep, setWalkthroughStep] = useState(initial?.walkthroughStep ?? 0)

  const selected = gameWords.find((item) => item.id === selectedWord) ?? gameWords[0]
  const todayDone = completed[todayKey] ?? []
  const dailyDoneCount = questWords.filter((item) => todayDone.includes(item.id)).length
  const level = Math.floor(points / 80) + 1
  const levelProgress = points % 80
  const currentScenario = getScenarioForSource(sectionInputs.task, scenarioIndex)
  const progressWords = getWordsForSource(sectionInputs.progress, baseDailySet, customFocus)
  const shuffledMeanings = useMemo(
    () => [...gameWords].sort((a, b) => a.meaning.localeCompare(b.meaning)),
    [gameWords],
  )

  function updateSectionInput(section, value) {
    setSectionInputs({ ...sectionInputs, [section]: value })
    setFeedback('Section input updated. Keep playing from the new source.')
  }

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
    const progress = {
      points,
      completed,
      scenarioIndex,
      sectionInputs,
      customFocus,
      showWalkthrough,
      walkthroughStep,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [
    points,
    completed,
    scenarioIndex,
    sectionInputs,
    customFocus,
    showWalkthrough,
    walkthroughStep,
  ])

  useEffect(() => {
    if (!gameWords.some((item) => item.id === selectedWord)) {
      setSelectedWord(gameWords[0].id)
    }
  }, [gameWords, selectedWord])

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

  function nextWalkthroughStep() {
    if (walkthroughStep >= walkthroughSteps.length - 1) {
      setShowWalkthrough(false)
      setWalkthroughStep(0)
      return
    }
    setWalkthroughStep(walkthroughStep + 1)
  }

  const activeWalkthrough = walkthroughSteps[walkthroughStep]

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
          <button className="guide-toggle" type="button" onClick={() => setShowWalkthrough(true)}>
            <Icon type="spark" />
            Walk me through
          </button>
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

      {showWalkthrough && (
        <section className="walkthrough-panel" aria-labelledby="walkthrough-title">
          <div className="walkthrough-copy">
            <span>
              Step {walkthroughStep + 1} of {walkthroughSteps.length}
            </span>
            <h2 id="walkthrough-title">{activeWalkthrough.title}</h2>
            <p>{activeWalkthrough.body}</p>
          </div>
          <div className="walkthrough-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setShowWalkthrough(false)
                setWalkthroughStep(0)
              }}
            >
              Skip
            </button>
            <button className="primary-action compact" type="button" onClick={nextWalkthroughStep}>
              {walkthroughStep >= walkthroughSteps.length - 1 ? 'Start learning' : 'Next step'}
            </button>
          </div>
        </section>
      )}

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
            <SourceControl
              id="quest-source"
              label="Quest input"
              value={sectionInputs.quest}
              customFocus={customFocus}
              onSourceChange={(value) => updateSectionInput('quest', value)}
              onCustomFocusChange={setCustomFocus}
            />
            {questWords.map((item) => (
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
            <SourceControl
              id="game-source"
              label="Game input"
              value={sectionInputs.game}
              customFocus={customFocus}
              onSourceChange={(value) => updateSectionInput('game', value)}
              onCustomFocusChange={setCustomFocus}
            />
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
          <SourceControl
            id="task-source"
            label="Task input"
            value={sectionInputs.task}
            customFocus={customFocus}
            onSourceChange={(value) => updateSectionInput('task', value)}
            onCustomFocusChange={setCustomFocus}
          />
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
          <SourceControl
            id="progress-source"
            label="Progress input"
            value={sectionInputs.progress}
            customFocus={customFocus}
            onSourceChange={(value) => updateSectionInput('progress', value)}
            onCustomFocusChange={setCustomFocus}
          />
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
              <span>Active source</span>
              <strong>{progressWords.map((item) => item.word).join(', ')}</strong>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
