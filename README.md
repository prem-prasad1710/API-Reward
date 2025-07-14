# Rewards API

A comprehensive rewards management system built with NestJS and MongoDB. This API supports user rewards, transactions, and redemption functionality with real-time updates and analytics.

## 🚀 Features

### Core Features
- **User Management**: Mock user data with unique user IDs
- **Rewards Management**: Track and manage user reward points
- **Transaction Management**: Record and retrieve reward-earning transactions
- **Redemption System**: Redeem points for various reward options
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Standardized error responses with meaningful messages

### Bonus Features
- **Analytics Dashboard**: Aggregate reward categories and distributions
- **Real-time Updates**: WebSocket support for live reward point updates
- **Caching**: Redis integration with fallback to in-memory cache
- **Swagger Documentation**: Complete API documentation with examples
- **Unit Testing**: Comprehensive test coverage with Jest
- **Docker Support**: Full containerization with Docker Compose

## 🛠️ Tech Stack

- **Framework**: NestJS (latest version)
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (with in-memory fallback)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Validation**: class-validator & class-transformer
- **Real-time**: Socket.IO WebSocket
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (18.x or higher)
- MongoDB (7.x or higher)
- Redis (7.x or higher) - Optional
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd reward_api
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env file with your configurations
```

### 3. Start Dependencies (Optional - if not using Docker)

**MongoDB:**
```bash
# Using MongoDB locally
mongod --dbpath /path/to/your/data/directory

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

**Redis (Optional):**
```bash
# Using Redis locally
redis-server

# Or using Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### 4. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 5. Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📚 API Documentation

### Core Endpoints

#### Rewards Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rewards/points?userId=user_1` | Get total reward points for a user |
| GET | `/rewards/transactions?userId=user_1&page=1&limit=5` | Get user transactions with pagination |
| POST | `/rewards/redeem` | Redeem reward points |
| GET | `/rewards/options` | Get available reward options |
| POST | `/rewards/transaction` | Create a new transaction (testing) |
| POST | `/rewards/seed` | Seed mock data |

#### Analytics (Bonus)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/rewards-distribution` | Get rewards distribution analytics |

#### Health & Info

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Detailed health check |

### Example API Requests

#### Get User Points
```bash
curl -X GET "http://localhost:3000/rewards/points?userId=user_1"
```

**Response:**
```json
{
  "userId": "user_1",
  "totalPoints": 245
}
```

#### Get Transactions with Pagination
```bash
curl -X GET "http://localhost:3000/rewards/transactions?userId=user_1&page=1&limit=5"
```

**Response:**
```json
{
  "transactions": [
    {
      "userId": "user_1",
      "amount": 150,
      "category": "Shopping",
      "pointsEarned": 15,
      "timestamp": "2025-07-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "totalPages": 2
  }
}
```

#### Redeem Points
```bash
curl -X POST "http://localhost:3000/rewards/redeem" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "pointsToRedeem": 100,
    "rewardType": "cashback"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Points redeemed successfully",
  "redemption": {
    "userId": "user_1",
    "pointsRedeemed": 100,
    "rewardType": "cashback",
    "timestamp": "2025-07-14T10:35:00.000Z"
  },
  "remainingPoints": 145
}
```

#### Create Transaction
```bash
curl -X POST "http://localhost:3000/rewards/transaction" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "amount": 200,
    "category": "Food"
  }'
```

## 🗄️ Database Schema

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  userId: String (unique),
  name: String,
  email: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

#### Rewards Collection
```javascript
{
  _id: ObjectId,
  userId: String (unique),
  totalPoints: Number,
  updatedAt: Date,
  createdAt: Date
}
```

#### Transactions Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  amount: Number,
  category: String,
  pointsEarned: Number,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Redemptions Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  pointsRedeemed: Number,
  rewardType: String,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# End-to-end tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Test Coverage
The project includes comprehensive unit tests for:
- Rewards Service (business logic)
- Rewards Controller (API endpoints)
- Error handling scenarios
- Edge cases (insufficient points, invalid users)

## 🔧 Development

### Project Structure
```
src/
├── analytics/          # Analytics module
├── config/             # Configuration files
├── dto/                # Data Transfer Objects
├── filters/            # Exception filters
├── rewards/            # Rewards module
├── schemas/            # MongoDB schemas
├── websocket/          # WebSocket gateway
├── app.module.ts       # Main app module
└── main.ts            # Application entry point
```

### Adding New Features
1. Create feature module: `nest g module feature-name`
2. Create service: `nest g service feature-name`
3. Create controller: `nest g controller feature-name`
4. Add tests and documentation

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rewards-api
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Production Checklist
- [ ] Set secure MongoDB connection
- [ ] Configure Redis for production
- [ ] Set proper environment variables
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategies

## 🔌 WebSocket Events

Connect to `ws://localhost:3000` to receive real-time updates:

### Events
- `points-update-{userId}`: Emitted when user's points change
- `transaction-created-{userId}`: Emitted when new transaction is created
- `redemption-success-{userId}`: Emitted when points are redeemed

### Example Client Code
```javascript
const socket = io('http://localhost:3000');

// Listen for points updates
socket.on('points-update-user_1', (data) => {
  console.log('Points updated:', data);
});
```

## 📊 Performance & Scalability

### Caching Strategy
- User points cached for 5 minutes
- Reward options cached for 1 hour
- Automatic cache invalidation on updates

### Database Indexes
Recommended indexes for production:
```javascript
// Users
db.users.createIndex({ "userId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Rewards
db.rewards.createIndex({ "userId": 1 }, { unique: true })

// Transactions
db.transactions.createIndex({ "userId": 1, "timestamp": -1 })
db.transactions.createIndex({ "category": 1 })

// Redemptions
db.redemptions.createIndex({ "userId": 1, "timestamp": -1 })
db.redemptions.createIndex({ "rewardType": 1 })
```

## 🛡️ Security Considerations

- Input validation using class-validator
- MongoDB injection prevention
- Error message sanitization
- Rate limiting (recommended for production)
- HTTPS enforcement (production)

## 🔄 CI/CD Pipeline

Example GitHub Actions workflow:
```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Swagger documentation at `/api`
- Review the test files for usage examples

## 🎯 Roadmap

- [ ] Add authentication and authorization
- [ ] Implement user roles and permissions
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add more reward types
- [ ] Implement reward expiration
- [ ] Add transaction categories management
- [ ] Create mobile app API optimizations
#   A P I - R e w a r d  
 