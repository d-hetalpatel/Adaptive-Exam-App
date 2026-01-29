# Adaptive Exam Platform

> A comprehensive web-based examination system with adaptive difficulty and content management

**Internship Project by ZenithIndia**  
**Developer:** Hetal Patel

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Installation

**1. Clone & Setup Backend**
```bash
# Install Python dependencies
cd backend
pip install flask flask-cors

# Start backend server
python app_enhanced.py
```

**2. Setup Frontend**
```bash
# Install Node dependencies
cd frontend
npm install

# Start development server
npm start
```

**3. Access Application**
- **Student Exam:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

---

## ✨ Features

### For Students
- 🎯 **Three Exam Modes:** Practice, Subject-wise, Mock Test
- 📊 **Adaptive Testing:** Questions selected by difficulty level
- ⏱️ **Real-time Timer:** Auto-submission when time expires
- 📈 **Instant Results:** Detailed performance analysis with explanations
- 🎨 **User-friendly Interface:** Clean, intuitive design

### For Administrators
- ➕ **Add Questions:** Intuitive form with validation
- ✏️ **Edit Questions:** Inline editing
- 🗑️ **Delete Operations:** Single and bulk delete
- 📁 **CSV Import/Export:** Bulk operations for large datasets
- 🔍 **Search & Filter:** By subject, difficulty, and keywords
- 🔐 **Secure Authentication:** Token-based admin access

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router
- Lucide React Icons

**Backend:**
- Flask (Python)
- Flask-CORS
- JSON-based storage

**Features:**
- RESTful API
- Token-based authentication
- Responsive design

---

## 📁 Project Structure

```
adaptive-exam-platform/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app with routing
│   │   ├── AdminLogin.jsx       # Admin authentication
│   │   └── AdminDashboard.jsx   # Admin CMS
│   └── package.json
│
├── backend/
│   ├── app_enhanced.py          # Flask API server
│   ├── questions.json           # Question database
│   └── admin_credentials.json   # Admin credentials
│
└── docs/
    └── PROJECT_DOCUMENTATION.md # Complete documentation
```

---

## 📖 Documentation

For detailed documentation, see:
- **[Complete Project Documentation](./PROJECT_DOCUMENTATION.md)** - Comprehensive guide covering installation, deployment, API reference, and more

### Quick Links
- [Installation Guide](./PROJECT_DOCUMENTATION.md#installation--setup)
- [API Documentation](./PROJECT_DOCUMENTATION.md#api-documentation)
- [User Guide](./PROJECT_DOCUMENTATION.md#user-guide)
- [Admin Guide](./PROJECT_DOCUMENTATION.md#admin-guide)
- [Deployment Guide](./PROJECT_DOCUMENTATION.md#deployment-guide)

---

## 🎯 Key Highlights

### Exam Modes

**1. Practice Mode**
- Select subject and difficulty
- Customize number of questions
- Set your own timer

**2. Subject-wise Test**
- Focus on specific subject
- Difficulty-based selection
- Comprehensive subject coverage

**3. Mock Test**
- Full-length adaptive test
- Questions across all subjects
- Intelligent difficulty distribution

### Admin Features

**Question Management:**
- Create, Read, Update, Delete operations
- Search across all questions
- Filter by subject and difficulty
- Bulk operations support

**Data Import/Export:**
- CSV upload for bulk import
- CSV export for backup
- Template-based format

---

## 🔐 Security Features

- Token-based authentication
- Session management (2-hour expiry)
- CORS protection
- Input validation
- Protected admin routes

---

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Deploy 'build' folder to static host
```

**Backend:**
```bash
# Use production WSGI server
gunicorn -w 4 -b 0.0.0.0:5000 app_enhanced:app
```

### Deployment Options
- Traditional server (Nginx + Gunicorn)
- Cloud platforms (Heroku, AWS, etc.)
- Docker containers
- Serverless functions

See [Deployment Guide](./PROJECT_DOCUMENTATION.md#deployment-guide) for detailed instructions.

---

## 📊 API Endpoints

### Public
- `GET /api/questions` - Get all questions

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify token

### Protected (Requires Authentication)
- `GET /api/admin/questions` - Get questions (admin)
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/{id}` - Update question
- `DELETE /api/admin/questions/{id}` - Delete question
- `POST /api/admin/questions/bulk-delete` - Bulk delete
- `POST /api/admin/questions/upload-csv` - CSV upload
- `GET /api/admin/questions/export-csv` - CSV export

---

## 🧪 Testing

### Manual Testing
```bash
# Test backend API
curl http://localhost:5000/api/questions

# Test admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Browser Testing
1. Open http://localhost:3000
2. Test all three exam modes
3. Complete a test and verify results
4. Access admin panel and perform CRUD operations

---

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5000 is available
- Verify Python dependencies installed
- Check if questions.json exists

**Frontend errors:**
- Verify Node.js is installed
- Run `npm install` again
- Clear browser cache

**API connection errors:**
- Ensure backend is running
- Check CORS configuration
- Verify API URL in frontend

See [Troubleshooting Guide](./PROJECT_DOCUMENTATION.md#troubleshooting) for detailed solutions.

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack web development
- ✅ RESTful API design and implementation
- ✅ React component architecture
- ✅ Authentication and authorization
- ✅ File operations and data persistence
- ✅ Responsive UI/UX design
- ✅ Production deployment practices

---

## 🔮 Future Enhancements

### Planned Features
- [ ] User registration and authentication
- [ ] Database migration (PostgreSQL/MySQL)
- [ ] Advanced analytics and reporting
- [ ] Image support in questions
- [ ] Mobile application
- [ ] AI-powered features
- [ ] Multi-tenancy support

See [Future Enhancements](./PROJECT_DOCUMENTATION.md#future-enhancements) for complete roadmap.

---

## 📝 CSV Format Reference

For bulk upload, use this format:

```csv
subject,difficulty,question,option_a,option_b,option_c,option_d,correct_answer,explanation
Quantitative Aptitude,Easy,What is 2+2?,2,3,4,5,C,Basic addition
General Knowledge,Medium,Capital of India?,Mumbai,Delhi,Kolkata,Chennai,B,Delhi is the capital
```

**Valid Subjects:**
- Quantitative Aptitude
- Verbal Ability
- Logical Reasoning
- General Knowledge
- General Science

**Valid Difficulties:**
- Very Easy, Easy, Medium, Hard, Very Hard

---

## 🤝 Contributing

This is an internship project. For suggestions or improvements:
1. Review the code
2. Test the application
3. Document any issues
4. Propose enhancements

---

## 📞 Support

For questions or issues:
- Review the [Complete Documentation](./PROJECT_DOCUMENTATION.md)
- Check [Troubleshooting Guide](./PROJECT_DOCUMENTATION.md#troubleshooting)
- Contact: [Add contact information]

---

## 📄 License

[Add appropriate license]

---

## 🙏 Acknowledgments

**Thanks to:**
- ZenithIndia for the internship opportunity
- Mentors for guidance and support
- Open source community for excellent tools

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

---

**Project Version:** 1.0  
**Last Updated:** January 2026  
**Developer:** Hetal Patel  
**Organization:** ZenithIndia

---

*Developed as part of the ZenithIndia Internship Program*
