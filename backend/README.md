# Sikkim Tourism Backend - MERN Stack

A comprehensive Node.js backend for Sikkim Tourism Platform featuring virtual monastery tours, audio guides, and manuscript collections.

## Features

- **RESTful API** for monasteries, virtual tours, audio guides, and manuscripts
- **MongoDB** with Mongoose ODM for data persistence
- **JWT Authentication** for secure user management
- **File Upload** system for images and audio files
- **Geospatial queries** for location-based monastery searches
- **Full-text search** across all content
- **Rate limiting** and security middleware
- **Database seeding** with sample data

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── audioGuideController.js
│   │   ├── monasteryController.js
│   │   ├── searchController.js
│   │   └── virtualTourController.js
│   ├── middleware/
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── AudioGuide.js
│   │   ├── Manuscript.js
│   │   ├── Monastery.js
│   │   ├── User.js
│   │   └── VirtualTour.js
│   ├── routes/
│   │   ├── audioGuideRoutes.js
│   │   ├── manuscriptRoutes.js
│   │   ├── monasteryRoutes.js
│   │   ├── searchRoutes.js
│   │   └── virtualTourRoutes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── seedDB.js            # Database seeder
│   │   └── validation.js
│   └── server.js                # Main application entry
├── uploads/
│   ├── manuscripts/             # Manuscript images
│   └── audio/                   # Audio guide files
├── .env.example
├── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (>= 18.0.0)
- MongoDB (local or Atlas)
- npm (>= 8.0.0)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   copy .env.example .env
   ```

4. **Configure .env file:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sikkim-tourism
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   ```

5. **Start MongoDB** (if using local installation)

6. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

7. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:5000`

## API Endpoints

### Monasteries
- `GET /api/monasteries` - Get all monasteries with filtering and pagination
- `GET /api/monasteries/:id` - Get specific monastery details
- `GET /api/monasteries/search` - Search monasteries by location or text

### Virtual Tours
- `GET /api/virtual-tours` - Get all virtual tours
- `GET /api/virtual-tours/:id` - Get specific virtual tour
- `GET /api/virtual-tours/monastery/:monasteryId` - Get tours for monastery

### Audio Guides
- `GET /api/audio-guides` - Get all audio guides
- `GET /api/audio-guides/:id` - Get specific audio guide
- `GET /api/audio-guides/monastery/:monasteryId` - Get guides for monastery

### Manuscripts
- `GET /api/manuscripts` - Get all manuscripts
- `GET /api/manuscripts/:id` - Get specific manuscript
- `POST /api/manuscripts` - Upload new manuscript (with authentication)

### Search
- `GET /api/search` - Global search across all content
- `GET /api/search/suggestions` - Get search suggestions

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (authenticated)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/sikkim-tourism |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload file size | 5242880 |

## Database Schema

### Monastery Model
- Basic information (name, description, location)
- Historical and architectural details
- Spiritual significance and festivals
- Visit information and amenities
- Images and ratings

### Virtual Tour Model
- Tour metadata and scenes
- Hotspot navigation data
- 360° image references
- Interactive elements

### Audio Guide Model
- Audio file information
- Transcripts and translations
- Multi-language support
- Categorization

### Manuscript Model
- Digital manuscript data
- Translation support
- Historical metadata
- Image references

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Populate database with sample data
- `npm run setup` - Install dependencies and copy .env file

## Development

### Adding New Routes
1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Add route to main `server.js`

### Database Operations
- Use Mongoose models for all database operations
- Implement proper error handling
- Add validation using Joi schemas

### File Uploads
- Configure Multer for file handling
- Store files in `uploads/` directory
- Validate file types and sizes

## Production Deployment

1. Set `NODE_ENV=production`
2. Use proper MongoDB Atlas URI
3. Generate secure JWT secret
4. Configure file upload limits
5. Set up proper CORS origins
6. Enable logging and monitoring

## Testing

Run the seeder to populate test data:
```bash
npm run seed
```

Test API endpoints using tools like Postman or Thunder Client.

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test thoroughly before committing

## License

MIT License - see LICENSE file for details.