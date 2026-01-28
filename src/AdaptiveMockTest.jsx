// Added normalize function to handle spaces and case differences
const normalize = (str) => str?.trim().toLowerCase(); // CHANGED

const startTest = () => {
    let filteredQuestions = [...questions];

    if (mode === 'subject-level') {
        // Replaced direct comparison with normalize function to avoid case/space mismatches
      filteredQuestions = questions.filter(
        q => normalize(q.subject) === normalize(selectedSubject) && // CHANGED
             normalize(q.difficulty) === normalize(selectedLevel)     // CHANGED
      );/*filteredQuestions = questions.filter(
        q => q.subject === selectedSubject && 
             q.difficulty.toLowerCase().replace(/\s+/g, '') === selectedLevel.toLowerCase().replace(/\s+/g, '')
      );*/      
      
    } else if (mode === 'mock-test') {
      const distribution = MOCK_TEST_CONFIG[selectedLevel];
      const totalQuestions = 20;
      let selectedQuestions = [];

      Object.entries(distribution).forEach(([level, percentage]) => {
        const count = Math.round((percentage / 100) * totalQuestions);
        const levelQuestions = questions.filter(
          q => q.difficulty.toLowerCase().replace(/\s+/g, '') === level.toLowerCase().replace(/\s+/g, '')
        );
        
        const shuffled = levelQuestions.sort(() => 0.5 - Math.random());
        selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, count)];
      });

      filteredQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
    } else if (mode === 'random') {
      filteredQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 20);
    }
      console.log("Filtered Questions:", filteredQuestions); // CHANGED - added debug log
    setTestQuestions(filteredQuestions.slice(0, 20));
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };