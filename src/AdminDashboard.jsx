import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  LogOut,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';

const AdminDashboard = ({ token, onLogout }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const SUBJECTS = [
    'Quantitative Aptitude',
    'Verbal Ability',
    'Logical Reasoning',
    'General Knowledge',
    'General Science',
  ];

  const DIFFICULTIES = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, filterSubject, filterDifficulty]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter((q) => q.subject === filterSubject);
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === filterDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setEditData({ ...question });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/questions/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        setSuccess('Question updated successfully');
        setEditingId(null);
        fetchQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update question');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Question deleted successfully');
        fetchQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete question');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      setError('Please select questions to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} questions?`))
      return;

    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/questions/bulk-delete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: Array.from(selectedIds) }),
        }
      );

      if (response.ok) {
        setSuccess('Questions deleted successfully');
        setSelectedIds(new Set());
        fetchQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete questions');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/questions/upload-csv',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Uploaded ${data.count} questions successfully`);
        fetchQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to upload CSV');
      }
    } catch (err) {
      setError('Failed to upload CSV');
    }

    e.target.value = '';
  };

  const handleCSVExport = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/questions/export-csv',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to export CSV');
      }
    } catch (err) {
      setError('Failed to export CSV');
    }
  };

  const handleAddQuestion = async (newQuestion) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        setSuccess('Question added successfully');
        setShowAddForm(false);
        fetchQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add question');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    localStorage.removeItem('adminToken');
    onLogout();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F3F4F6',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
    },
    toolbar: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    button: {
      padding: '10px 16px',
      backgroundColor: '#2563EB',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
    },
    dangerButton: {
      backgroundColor: '#EF4444',
    },
    secondaryButton: {
      backgroundColor: '#6B7280',
    },
    table: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    th: {
      backgroundColor: '#F9FAFB',
      padding: '16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '2px solid #E5E7EB',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #E5E7EB',
      color: '#1F2937',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    alert: {
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    success: {
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      border: '1px solid #6EE7B7',
    },
    error: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #FCA5A5',
    },
  };

  const getBadgeColor = (difficulty) => {
    const colors = {
      'Very Easy': { bg: '#D1FAE5', color: '#065F46' },
      Easy: { bg: '#DBEAFE', color: '#1E40AF' },
      Medium: { bg: '#FEF3C7', color: '#92400E' },
      Hard: { bg: '#FECACA', color: '#991B1B' },
      'Very Hard': { bg: '#E5E7EB', color: '#1F2937' },
    };
    return colors[difficulty] || colors.Medium;
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6B7280' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {success && (
        <div style={{ ...styles.alert, ...styles.success }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ ...styles.alert, ...styles.error }}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Question Bank CMS</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>
            {filteredQuestions.length} questions
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{ ...styles.button, ...styles.dangerButton }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#DC2626')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#EF4444')}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div style={styles.toolbar}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => setShowAddForm(true)}
            style={styles.button}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#1D4ED8')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563EB')}
          >
            <Plus size={18} />
            Add Question
          </button>

          <label style={{ ...styles.button, ...styles.secondaryButton }}>
            <Upload size={18} />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              style={{ display: 'none' }}
            />
          </label>

          <button
            onClick={handleCSVExport}
            style={{ ...styles.button, ...styles.secondaryButton }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#4B5563')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#6B7280')}
          >
            <Download size={18} />
            Export CSV
          </button>

          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{ ...styles.button, ...styles.dangerButton }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#DC2626')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#EF4444')}
            >
              <Trash2 size={18} />
              Delete Selected ({selectedIds.size})
            </button>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Difficulties</option>
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddQuestionForm
          onSave={handleAddQuestion}
          onCancel={() => setShowAddForm(false)}
          subjects={SUBJECTS}
          difficulties={DIFFICULTIES}
        />
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                <input
                  type="checkbox"
                  checked={
                    selectedIds.size === filteredQuestions.length &&
                    filteredQuestions.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Difficulty</th>
              <th style={styles.th}>Question</th>
              <th style={styles.th}>Options</th>
              <th style={styles.th}>Answer</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td style={styles.td}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(question.id)}
                    onChange={() => toggleSelect(question.id)}
                  />
                </td>
                <td style={styles.td}>{question.id}</td>
                <td style={styles.td}>
                  {editingId === question.id ? (
                    <select
                      value={editData.subject}
                      onChange={(e) =>
                        setEditData({ ...editData, subject: e.target.value })
                      }
                      style={styles.select}
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ fontSize: '13px' }}>{question.subject}</span>
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === question.id ? (
                    <select
                      value={editData.difficulty}
                      onChange={(e) =>
                        setEditData({ ...editData, difficulty: e.target.value })
                      }
                      style={styles.select}
                    >
                      {DIFFICULTIES.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: getBadgeColor(question.difficulty).bg,
                        color: getBadgeColor(question.difficulty).color,
                      }}
                    >
                      {question.difficulty}
                    </span>
                  )}
                </td>
                <td style={{ ...styles.td, maxWidth: '300px' }}>
                  {editingId === question.id ? (
                    <textarea
                      value={editData.question}
                      onChange={(e) =>
                        setEditData({ ...editData, question: e.target.value })
                      }
                      style={{ ...styles.input, minHeight: '60px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '13px' }}>{question.question}</div>
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === question.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {['a', 'b', 'c', 'd'].map((opt) => (
                        <input
                          key={opt}
                          value={editData[`option_${opt}`]}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              [`option_${opt}`]: e.target.value,
                            })
                          }
                          style={{ ...styles.input, fontSize: '12px' }}
                          placeholder={`Option ${opt.toUpperCase()}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px' }}>
                      {['a', 'b', 'c', 'd'].map((opt) => (
                        <div key={opt}>
                          <strong>{opt.toUpperCase()}:</strong>{' '}
                          {question[`option_${opt}`]}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === question.id ? (
                    <select
                      value={editData.correct_answer}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          correct_answer: e.target.value,
                        })
                      }
                      style={styles.select}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: '#10B981',
                        fontSize: '14px',
                      }}
                    >
                      {question.correct_answer}
                    </span>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {editingId === question.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#6B7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(question)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#2563EB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQuestions.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6B7280',
            backgroundColor: 'white',
            borderRadius: '12px',
            marginTop: '24px',
          }}
        >
          No questions found. Try adjusting your filters or add a new question.
        </div>
      )}
    </div>
  );
};

const AddQuestionForm = ({ onSave, onCancel, subjects, difficulties }) => {
  const [formData, setFormData] = useState({
    subject: subjects[0],
    difficulty: difficulties[2],
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: '#1F2937',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '80px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    button: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    submitButton: {
      backgroundColor: '#2563EB',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#E5E7EB',
      color: '#374151',
    },
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Add New Question</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Subject</label>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              style={styles.select}
              required
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              style={styles.select}
              required
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Question</label>
            <textarea
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              style={styles.textarea}
              required
            />
          </div>

          {['a', 'b', 'c', 'd'].map((opt) => (
            <div key={opt} style={styles.formGroup}>
              <label style={styles.label}>Option {opt.toUpperCase()}</label>
              <input
                type="text"
                value={formData[`option_${opt}`]}
                onChange={(e) =>
                  setFormData({ ...formData, [`option_${opt}`]: e.target.value })
                }
                style={styles.input}
                required
              />
            </div>
          ))}

          <div style={styles.formGroup}>
            <label style={styles.label}>Correct Answer</label>
            <select
              value={formData.correct_answer}
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              style={styles.select}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Explanation</label>
            <textarea
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.submitButton }}
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
