import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, CheckCircle, XCircle, Book, Award, Clock, Settings } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

// Your existing exam component (keeping all the code from your original App.jsx)
function ExamApp() {
  // All your existing state and code from the original App.jsx
  const SUBJECTS = [
    "Quantitative Aptitude",
    "Verbal Ability",
    "Logical Reasoning",
    "General Knowledge",
    "General Science"
  ];

  const DIFFICULTY_LEVELS = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];

  const MOCK_TEST_CONFIG = {
    "Very Easy": { "Very Easy": 60, "Easy": 30, "Medium": 10, "Hard": 0, "Very Hard": 0 },
    "Easy": { "Very Easy": 30, "Easy": 40, "Medium": 20, "Hard": 10, "Very Hard": 0 },
    "Medium": { "Very Easy": 10, "Easy": 30, "Medium": 40, "Hard": 15, "Very Hard": 5 },
    "Hard": { "Very Easy": 0, "Easy": 10, "Medium": 30, "Hard": 40, "Very Hard": 20 },
    "Very Hard": { "Very Easy": 0, "Easy": 0, "Medium": 10, "Hard": 30, "Very Hard": 60 }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EBF4FF 0%, #E0E7FF 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '40px',
      maxWidth: '1200px',
      width: '100%',
      boxSizing: 'border-box'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '8px',
      textAlign: 'center'
    },
    subtitle: {
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: '48px'
    },
    modeGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '24px',
      marginTop: '40px',
      justifyContent: 'center'
    },
    modeCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '32px',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.3s ease',
      flex: '1 1 250px',
      maxWidth: '280px',
      minWidth: '250px'
    },
    modeCardHover: {
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)'
    },
    modeTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '8px',
      marginTop: '16px'
    },
    modeDescription: {
      color: '#6B7280',
      fontSize: '14px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '24px',
      backgroundColor: 'white'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '24px',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#2563EB',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#D1D5DB',
      cursor: 'not-allowed'
    },
    backButton: {
      color: '#2563EB',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '24px',
      padding: '8px 0'
    },
    questionCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '32px',
      maxWidth: '800px',
      width: '100%',
      boxSizing: 'border-box'
    },
    optionButton: {
      width: '100%',
      padding: '16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      backgroundColor: 'white',
      textAlign: 'left',
      cursor: 'pointer',
      marginBottom: '12px',
      fontSize: '16px',
      transition: 'all 0.2s'
    },
    optionSelected: {
      borderColor: '#2563EB',
      backgroundColor: '#EFF6FF'
    },
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500'
    },
    resultItem: {
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    },
    scoreCircle: {
      fontSize: '64px',
      fontWeight: 'bold',
      color: '#2563EB',
      margin: '24px 0',
      textAlign: 'center'
    },
    distributionBox: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#F9FAFB',
      borderRadius: '8px'
    },
    settingsBox: {
      padding: '20px',
      backgroundColor: '#F9FAFB',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    timerWarning: {
      color: '#EF4444',
      fontWeight: 'bold'
    },
    stopButton: {
      padding: '10px 20px',
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  const [mode, setMode] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [hoveredMode, setHoveredMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  const [numQuestions, setNumQuestions] = useState(20);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const QUESTIONS_API_URL = "https://adaptive-exam-cms-api.onrender.com";//"http://localhost:5000/api/questions";

  useEffect(() => {
    fetch(QUESTIONS_API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load questions. Please make sure the backend is running on port 5000.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && timerInterval) {
      clearInterval(timerInterval);
      setShowResults(true);
    }
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const stopExam = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setShowResults(true);
  };

  const selectQuestionsByDifficulty = (distribution, count) => {
    const selected = [];
    const availableQuestions = { ...questions };
    
    Object.entries(distribution).forEach(([difficulty, percentage]) => {
      const numToSelect = Math.round((percentage / 100) * count);
      const difficultyQuestions = questions.filter(q => q.difficulty === difficulty);
      
      for (let i = 0; i < numToSelect && difficultyQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
        selected.push(difficultyQuestions[randomIndex]);
        difficultyQuestions.splice(randomIndex, 1);
      }
    });
    
    return selected;
  };

  const startTest = () => {
    let selectedQuestions = [];
    
    if (mode === 'subject-wise') {
      let subjectQuestions = questions.filter(q => q.subject === selectedSubject);
      
      // If difficulty level is selected, filter by difficulty too
      if (selectedLevel) {
        subjectQuestions = subjectQuestions.filter(q => q.difficulty === selectedLevel);
      }
      
      selectedQuestions = subjectQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numQuestions, subjectQuestions.length));
    } else if (mode === 'mock-test') {
      const distribution = MOCK_TEST_CONFIG[selectedLevel];
      selectedQuestions = selectQuestionsByDifficulty(distribution, numQuestions);
    } else {
      selectedQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numQuestions, questions.length));
    }
    
    setTestQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(timerMinutes * 60);
    startTimer();
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    const questionsToEvaluate = testQuestions.slice(0, currentQuestionIndex + 1);
    let correct = 0;
    let wrong = 0;
    
    questionsToEvaluate.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correct++;
      } else if (answers[index]) {
        wrong++;
      }
    });
    
    return { correct, wrong, total: questionsToEvaluate.length };
  };

  const reset = () => {
    setMode(null);
    setSelectedSubject(null);
    setSelectedLevel(null);
    setTestQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setTimeRemaining(0);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Loading Questions...</h2>
          <p style={styles.subtitle}>Please wait while we fetch the questions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{...styles.title, color: '#EF4444'}}>Error</h2>
          <p style={styles.subtitle}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563EB'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Adaptive Mock Test Platform</h1>
          <p style={styles.subtitle}>Choose your test mode to get started</p>
          
          <div style={styles.modeGrid}>
            <div
              style={{
                ...styles.modeCard,
                ...(hoveredMode === 'subject-wise' ? styles.modeCardHover : {}),
                borderColor: hoveredMode === 'subject-wise' ? '#2563EB' : 'transparent'
              }}
              onClick={() => setMode('subject-wise')}
              onMouseEnter={() => setHoveredMode('subject-wise')}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <Book size={48} color="#2563EB" />
              <h3 style={styles.modeTitle}>Subject-wise Test</h3>
              <p style={styles.modeDescription}>
                Focus on a specific subject and test your knowledge in that area
              </p>
            </div>

            <div
              style={{
                ...styles.modeCard,
                ...(hoveredMode === 'mock-test' ? styles.modeCardHover : {}),
                borderColor: hoveredMode === 'mock-test' ? '#2563EB' : 'transparent'
              }}
              onClick={() => setMode('mock-test')}
              onMouseEnter={() => setHoveredMode('mock-test')}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <Award size={48} color="#10B981" />
              <h3 style={styles.modeTitle}>Mock Test</h3>
              <p style={styles.modeDescription}>
                Take a full-length mock test with questions of varying difficulty
              </p>
            </div>

            <div
              style={{
                ...styles.modeCard,
                ...(hoveredMode === 'random' ? styles.modeCardHover : {}),
                borderColor: hoveredMode === 'random' ? '#2563EB' : 'transparent'
              }}
              onClick={() => setMode('random')}
              onMouseEnter={() => setHoveredMode('random')}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <RotateCcw size={48} color="#F59E0B" />
              <h3 style={styles.modeTitle}>Random Practice</h3>
              <p style={styles.modeDescription}>
                Practice with random questions from all subjects
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testQuestions.length) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <button onClick={reset} style={styles.backButton}>
            ← Back to Mode Selection
          </button>
          
          <h2 style={styles.title}>
            {mode === 'subject-wise' ? 'Subject-wise Test' : 
             mode === 'mock-test' ? 'Mock Test' : 'Random Practice'}
          </h2>
          
          <div style={styles.settingsBox}>
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
              <div style={{flex: 1}}>
                <label style={styles.label}>
                  <Settings size={16} style={{display: 'inline', marginRight: '8px'}} />
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value) || 20)}
                  style={styles.input}
                />
              </div>
              <div style={{flex: 1}}>
                <label style={styles.label}>
                  <Clock size={16} style={{display: 'inline', marginRight: '8px'}} />
                  Timer (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 30)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {mode === 'subject-wise' && (
            <div>
              <label style={styles.label}>Select Subject:</label>
              <select
                value={selectedSubject || ''}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={styles.select}
              >
                <option value="">Choose a subject...</option>
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <label style={styles.label}>Select Difficulty Level (Optional):</label>
              <select
                value={selectedLevel || ''}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={styles.select}
              >
                <option value="">All Difficulties</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}

          {mode === 'mock-test' && (
            <div>
              <label style={styles.label}>Select Difficulty Level:</label>
              <select
                value={selectedLevel || ''}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={styles.select}
              >
                <option value="">Choose difficulty...</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              
              {selectedLevel && (
                <div style={styles.distributionBox}>
                  <p style={{fontWeight: 'bold', marginBottom: '12px', color: '#374151'}}>
                    Question Distribution:
                  </p>
                  {Object.entries(MOCK_TEST_CONFIG[selectedLevel]).map(([diff, percent]) => (
                    <div key={diff} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{color: '#6B7280'}}>{diff}:</span>
                      <span style={{fontWeight: '500', color: '#1F2937'}}>{percent}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{marginTop: '32px'}}>
            <button
              onClick={startTest}
              disabled={(mode === 'subject-wise' && !selectedSubject) || 
                       (mode === 'mock-test' && !selectedLevel)}
              style={{
                ...styles.button,
                ...((mode === 'subject-wise' && !selectedSubject) || 
                    (mode === 'mock-test' && !selectedLevel) ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!((mode === 'subject-wise' && !selectedSubject) || 
                      (mode === 'mock-test' && !selectedLevel))) {
                  e.target.style.backgroundColor = '#1D4ED8';
                }
              }}
              onMouseLeave={(e) => {
                if (!((mode === 'subject-wise' && !selectedSubject) || 
                      (mode === 'mock-test' && !selectedLevel))) {
                  e.target.style.backgroundColor = '#2563EB';
                }
              }}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { correct, wrong, total } = calculateScore();
    const percentage = Math.round((correct / total) * 100);
    const unanswered = total - correct - wrong;
    const totalTime = timerMinutes * 60;
    const timeTaken = totalTime - timeRemaining;
    
    const questionsToShow = testQuestions.slice(0, currentQuestionIndex + 1);

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{...styles.title, fontSize: '32px'}}>Test Complete!</h2>
          <div style={styles.scoreCircle}>{percentage}%</div>
          <p style={{...styles.subtitle, fontSize: '20px', marginBottom: '16px'}}>
            You scored {correct} out of {total} questions
          </p>
          <p style={{...styles.subtitle, fontSize: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
            <Clock size={18} />
            Time taken: {formatTime(timeTaken)}
          </p>
          
          {questionsToShow.length < testQuestions.length && (
            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#92400E',
              textAlign: 'center'
            }}>
              Note: You stopped the exam early. Showing results for {questionsToShow.length} of {testQuestions.length} questions.
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#10B981'}}>{correct}</div>
              <div style={{color: '#6B7280', fontSize: '14px'}}>Correct</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#EF4444'}}>{wrong}</div>
              <div style={{color: '#6B7280', fontSize: '14px'}}>Wrong</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#9CA3AF'}}>{unanswered}</div>
              <div style={{color: '#6B7280', fontSize: '14px'}}>Unanswered</div>
            </div>
          </div>

          <div style={{marginBottom: '32px', maxHeight: '400px', overflowY: 'auto'}}>
            {questionsToShow.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correct_answer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div key={index} style={styles.resultItem}>
                  <div style={{display: 'flex', gap: '12px'}}>
                    {wasAnswered && isCorrect ? (
                      <CheckCircle size={24} color="#10B981" style={{flexShrink: 0, marginTop: '2px'}} />
                    ) : wasAnswered && !isCorrect ? (
                      <XCircle size={24} color="#EF4444" style={{flexShrink: 0, marginTop: '2px'}} />
                    ) : (
                      <XCircle size={24} color="#9CA3AF" style={{flexShrink: 0, marginTop: '2px'}} />
                    )}
                    <div style={{flex: 1}}>
                      <p style={{fontWeight: '500', color: '#1F2937', marginBottom: '8px'}}>
                        Q{index + 1}. {q.question}
                      </p>
                      <div style={{fontSize: '14px'}}>
                        <p style={{color: '#6B7280', marginBottom: '4px'}}>
                          <strong>Your answer:</strong> {userAnswer ? `${userAnswer}. ${q[`option_${userAnswer.toLowerCase()}`]}` : 'Not answered'}
                        </p>
                        <p style={{color: '#10B981', marginBottom: '4px'}}>
                          <strong>Correct answer:</strong> {q.correct_answer}. {q[`option_${q.correct_answer.toLowerCase()}`]}
                        </p>
                        <p style={{color: '#9CA3AF', fontStyle: 'italic'}}>{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={reset}
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563EB'}
          >
            Start New Test
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testQuestions[currentQuestionIndex];
  const userAnswer = answers[currentQuestionIndex];
  const isTimeCritical = timeRemaining <= 60;

  return (
    <div style={styles.container}>
      <div style={styles.questionCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <span style={{fontSize: '14px', fontWeight: '500', color: '#6B7280'}}>
            Question {currentQuestionIndex + 1} of {testQuestions.length}
          </span>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '16px', 
              fontWeight: '500',
              ...(isTimeCritical ? styles.timerWarning : {color: '#2563EB'})
            }}>
              <Clock size={20} />
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={stopExam}
              style={styles.stopButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
            >
              Stop Exam
            </button>
            <span style={styles.badge}>
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        <div style={{marginBottom: '8px'}}>
          <span style={{fontSize: '14px', color: '#9CA3AF'}}>{currentQuestion.subject}</span>
        </div>

        <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px'}}>
          {currentQuestion.question}
        </h3>

        <div style={{marginBottom: '32px'}}>
          {['A', 'B', 'C', 'D'].map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              style={{
                ...styles.optionButton,
                ...(userAnswer === option ? styles.optionSelected : {})
              }}
              onMouseEnter={(e) => {
                if (userAnswer !== option) {
                  e.target.style.borderColor = '#93C5FD';
                }
              }}
              onMouseLeave={(e) => {
                if (userAnswer !== option) {
                  e.target.style.borderColor = '#E5E7EB';
                }
              }}
            >
              <strong>{option}.</strong> {currentQuestion[`option_${option.toLowerCase()}`]}
            </button>
          ))}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              style={{
                ...styles.button,
                width: 'auto',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#6B7280',
                ...(currentQuestionIndex === 0 ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (currentQuestionIndex > 0) {
                  e.target.style.backgroundColor = '#4B5563';
                }
              }}
              onMouseLeave={(e) => {
                if (currentQuestionIndex > 0) {
                  e.target.style.backgroundColor = '#6B7280';
                }
              }}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <div style={{fontSize: '14px', color: '#6B7280'}}>
              {Object.keys(answers).length} of {testQuestions.length} answered
            </div>
          </div>
          <button
            onClick={nextQuestion}
            style={{
              ...styles.button,
              width: 'auto',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1D4ED8';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2563EB';
            }}
          >
            {currentQuestionIndex < testQuestions.length - 1 ? 'Next' : 'Finish'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App with routing
function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  const handleLoginSuccess = (token) => {
    setAdminToken(token);
  };

  const handleLogout = () => {
    setAdminToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public exam route */}
        <Route path="/" element={<ExamApp />} />
        
        {/* Admin login route */}
        <Route 
          path="/admin/login" 
          element={
            adminToken ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
          } 
        />
        
        {/* Admin dashboard route - protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            adminToken ? 
              <AdminDashboard token={adminToken} onLogout={handleLogout} /> : 
              <Navigate to="/admin/login" replace />
          } 
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
