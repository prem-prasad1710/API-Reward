# 🎁 Rewards Management API

<div align="center">

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-15%2F15_Passing-brightgreen?style=for-the-badge&logo=jest)

**Enterprise-grade rewards management system with real-time updates**

[🚀 Quick Start](#-quick-start) • [📚 API Documentation](#-api-documentation) • [🧪 Demo](#-demo)

</div>

## ✨ Features

<table>
<tr>
<td>

### 🎯 Core Features
- 👤 **User Management** - Mock user data with unique user IDs
- 🏆 **Rewards Tracking** - Track and manage user reward points
- 💳 **Transaction System** - Record and retrieve reward-earning transactions
- 🎁 **Redemption Engine** - Redeem points for various reward options
- ✅ **Data Validation** - Comprehensive input validation using class-validator
- 🚨 **Error Handling** - Standardized error responses with meaningful messages

</td>
<td>

### 🚀 Advanced Features
- 📊 **Analytics Dashboard** - Aggregate reward categories and distributions
- ⚡ **Real-time Updates** - WebSocket support for live reward point updates
- 🗄️ **Smart Caching** - Redis integration with fallback to in-memory cache
- 📖 **API Documentation** - Complete Swagger documentation with examples
- 🧪 **Unit Testing** - Comprehensive test coverage with Jest (15/15 tests)
- 🐳 **Docker Support** - Full containerization with Docker Compose

</td>
</tr>
</table>

## 🛠️ Tech Stack

<div align="center">

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| 🏗️ **Framework** | NestJS | Latest | Modern Node.js framework |
| 🗄️ **Database** | MongoDB + Mongoose | 7.x | Document database & ODM |
| ⚡ **Cache** | Redis | 7.x | High-performance caching |
| 📖 **Documentation** | Swagger/OpenAPI | Latest | Interactive API docs |
| 🧪 **Testing** | Jest | Latest | Unit & integration testing |
| ✅ **Validation** | class-validator | Latest | Input validation & transformation |
| 🔄 **Real-time** | Socket.IO | Latest | WebSocket communication |
| 🐳 **Containerization** | Docker & Docker Compose | Latest | Container orchestration |
| 🎯 **Language** | TypeScript | Latest | Type-safe JavaScript |

</div>

## � Quick Start

### �📋 Prerequisites

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x+-4ea94b?style=flat&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-7.x+-dc382d?style=flat&logo=redis)
![npm](https://img.shields.io/badge/npm-Latest-cb3837?style=flat&logo=npm)

</div>

### ⚡ Option 1: Docker Compose (Recommended)

```bash
# 🔥 One command setup - starts everything!
git clone https://github.com/prem-prasad1710/API-Reward.git
cd API-Reward
docker-compose up -d

# 🎉 Your API is ready at http://localhost:3001
```

### �️ Option 2: Manual Setup

```bash
# 1️⃣ Clone and install dependencies
git clone https://github.com/prem-prasad1710/API-Reward.git
cd API-Reward
npm install

# 2️⃣ Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# 3️⃣ Start MongoDB (if not using Docker)
# Using Docker: docker run -d -p 27017:27017 --name mongodb mongo:7
# Or install locally and run: mongod

# 4️⃣ Start Redis (optional - has fallback)
# Using Docker: docker run -d -p 6379:6379 --name redis redis:7-alpine
# Or install locally and run: redis-server

# 5️⃣ Run the application
npm run start:dev
```

### 🌐 Access Points

<div align="center">

| Service | URL | Description |
|---------|-----|-------------|
| 🔌 **API** | http://localhost:3001 | Main API endpoints |
| 📖 **Swagger UI** | http://localhost:3001/api | Interactive API documentation |
| 🏥 **Health Check** | http://localhost:3001/health | Application health status |
| 🧪 **Test Interface** | Open `api-tester.html` | Interactive testing page |

</div>

## 📚 API Documentation

<div align="center">

### 🔗 Core Endpoints

</div>

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| 🔍 **GET** | `/rewards/points?userId=user_1` | Get total reward points | Returns user's current balance |
| 📋 **GET** | `/rewards/transactions?userId=user_1&page=1&limit=5` | Get transaction history | Paginated transaction list |
| 🎁 **POST** | `/rewards/redeem` | Redeem reward points | Exchange points for rewards |
| 📦 **GET** | `/rewards/options` | Get available rewards | List all redemption options |
| 💳 **POST** | `/rewards/transaction` | Create new transaction | Add purchase & earn points |
| 🌱 **POST** | `/rewards/seed` | Seed mock data | Initialize test data |
| 📊 **GET** | `/analytics/rewards-distribution` | Analytics data | Rewards distribution stats |

### 🧪 Quick API Test

<details>
<summary>📖 Click to see example requests</summary>

#### 1️⃣ Seed Test Data
```bash
curl -X POST http://localhost:3001/rewards/seed
# ✅ Creates 5 users with transaction history
```

#### 2️⃣ Get User Points
```bash
curl -X GET "http://localhost:3001/rewards/points?userId=user_1"
```
```json
{
  "userId": "user_1",
  "totalPoints": 276,
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### 3️⃣ Create Transaction & Earn Points
```bash
curl -X POST "http://localhost:3001/rewards/transaction" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "amount": 200,
    "category": "Food"
  }'
```
```json
{
  "message": "Transaction created successfully",
  "pointsEarned": 20,
  "totalPoints": 296
}
```

#### 4️⃣ Redeem Points for Rewards
```bash
curl -X POST "http://localhost:3001/rewards/redeem" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "pointsToRedeem": 100,
    "rewardType": "cashback"
  }'
```
```json
{
  "message": "Points redeemed successfully",
  "remainingPoints": 196
}
```

#### 5️⃣ View Analytics
```bash
curl -X GET "http://localhost:3001/analytics/rewards-distribution"
```

</details>

### 🎮 Interactive Testing

We've included an **interactive HTML testing interface**! Simply open `api-tester.html` in your browser for a user-friendly way to test all endpoints.

<div align="center">

![Testing Interface](https://img.shields.io/badge/🧪_Interactive_Tester-HTML_Interface-success?style=for-the-badge)

</div>

## 🗄️ Database Architecture

<div align="center">

### 📊 Collections Overview

</div>

<table>
<tr>
<td>

#### 👤 Users Collection
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

#### 🏆 Rewards Collection
```javascript
{
  _id: ObjectId,
  userId: String (unique),
  totalPoints: Number,
  updatedAt: Date,
  createdAt: Date
}
```

</td>
<td>

#### 💳 Transactions Collection
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

#### 🎁 Redemptions Collection
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

</td>
</tr>
</table>

### 🎯 Points Calculation Logic

| Transaction Amount | Points Earned | Rule |
|-------------------|---------------|------|
| $100 | 10 points | **10% of amount** |
| $250 | 25 points | **10% of amount** |
| $50 | 5 points | **10% of amount** |
| Any amount | Min 1 point | **Guaranteed minimum** |

## 🧪 Testing

<div align="center">

![Tests](https://img.shields.io/badge/Tests-15%2F15_Passing-brightgreen?style=for-the-badge&logo=jest)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen?style=for-the-badge)

</div>

### 🚀 Run Tests

```bash
# 🧪 Run all unit tests
npm run test

# 📊 Generate coverage report
npm run test:cov

# 🔄 Watch mode for development
npm run test:watch

# 🌐 End-to-end tests
npm run test:e2e
```

### 📋 Test Coverage

<table>
<tr>
<td align="center">

**✅ Rewards Service**
7 tests passing

</td>
<td align="center">

**✅ Rewards Controller**
4 tests passing

</td>
<td align="center">

**✅ Analytics Service**
2 tests passing

</td>
<td align="center">

**✅ Analytics Controller**
2 tests passing

</td>
</tr>
</table>

### 🎯 Test Scenarios Covered
- ✅ User points retrieval and calculation
- ✅ Transaction creation and validation
- ✅ Points redemption with insufficient balance handling
- ✅ Error handling for invalid users and data
- ✅ Caching behavior and fallback mechanisms
- ✅ Analytics data aggregation
- ✅ WebSocket event emissions

## 🔧 Development

<div align="center">

### 📁 Project Structure

</div>

```
src/
├── 📊 analytics/          # Analytics module with distribution stats
├── ⚙️ config/             # Configuration files
├── 📦 dto/                # Data Transfer Objects for validation
├── 🚨 filters/            # Global exception filters
├── 🎁 rewards/            # Core rewards module (service + controller)
├── 🗄️ schemas/            # MongoDB schemas with Mongoose
├── 🔌 gateways/           # WebSocket gateway for real-time updates
├── 📱 app.module.ts       # Main application module
└── 🚀 main.ts            # Application entry point & Swagger setup
```

### 🛠️ Development Commands

```bash
# 🔥 Start development server with hot reload
npm run start:dev

# 🏗️ Build for production
npm run build

# 🚀 Start production server
npm run start:prod

# 🧹 Lint code
npm run lint

# 🔧 Format code
npm run format
```

### ➕ Adding New Features

<details>
<summary>📖 Step-by-step guide</summary>

```bash
# 1️⃣ Generate new module
nest g module feature-name

# 2️⃣ Generate service
nest g service feature-name

# 3️⃣ Generate controller
nest g controller feature-name

# 4️⃣ Add tests
# Create feature-name.service.spec.ts
# Create feature-name.controller.spec.ts

# 5️⃣ Update documentation
# Add endpoints to README
# Update Swagger decorators
```

</details>

## 🚀 Deployment

<div align="center">

### 🌐 Environment Configuration

</div>

<table>
<tr>
<td>

#### 🏠 Development
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/rewards-api
REDIS_HOST=localhost
REDIS_PORT=6379
```

</td>
<td>

#### 🏭 Production
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rewards
REDIS_URL=redis://redis-cluster:6379
```

</td>
</tr>
</table>

### ✅ Production Deployment Checklist

<table>
<tr>
<td>

#### 🔒 Security
- [ ] Secure MongoDB connection string
- [ ] Redis password authentication
- [ ] Environment variables properly set
- [ ] HTTPS enforcement enabled
- [ ] CORS configured for production
- [ ] Rate limiting implemented

</td>
<td>

#### 📊 Monitoring
- [ ] Health check endpoints active
- [ ] Application logging configured
- [ ] Error tracking setup
- [ ] Performance monitoring
- [ ] Database backup strategy
- [ ] Uptime monitoring

</td>
</tr>
</table>

### 🐳 Docker Deployment

```bash
# Build production image
docker build -t rewards-api .

# Run with environment variables
docker run -d \
  --name rewards-api \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your_mongodb_uri \
  rewards-api
```

### ☁️ Cloud Deployment Options

<div align="center">

| Platform | Complexity | Cost | Scalability |
|----------|------------|------|-------------|
| 🚀 **Heroku** | Low | $ | Medium |
| ⚡ **Railway** | Low | $ | Medium |
| 🌊 **DigitalOcean** | Medium | $$ | High |
| ☁️ **AWS/GCP/Azure** | High | $$$ | Very High |

</div>

## 🔌 WebSocket Events

<div align="center">

### ⚡ Real-time Updates

Connect to `ws://localhost:3001` for live notifications

</div>

| Event | Trigger | Data |
|-------|---------|------|
| 🎯 `pointsUpdated` | When user points change | `{ userId, totalPoints, change }` |
| 💳 `transactionCreated` | New transaction added | `{ userId, amount, pointsEarned }` |
| 🎁 `pointsRedeemed` | Points redeemed successfully | `{ userId, pointsRedeemed, rewardType }` |

### 🧑‍💻 Client Implementation

<details>
<summary>📖 JavaScript Example</summary>

```javascript
// Connect to WebSocket
const socket = io('http://localhost:3001');

// Listen for real-time updates
socket.on('pointsUpdated', (data) => {
  console.log(`🎉 ${data.userId} now has ${data.totalPoints} points!`);
  updateUI(data.totalPoints);
});

socket.on('transactionCreated', (data) => {
  console.log(`💳 New transaction: $${data.amount} → ${data.pointsEarned} points`);
  showNotification('Transaction successful!');
});

socket.on('pointsRedeemed', (data) => {
  console.log(`🎁 Redeemed ${data.pointsRedeemed} points for ${data.rewardType}`);
  updateRewardsDisplay();
});
```

</details>

<details>
<summary>📖 React Example</summary>

```jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function RewardsComponent() {
  const [points, setPoints] = useState(0);
  
  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('pointsUpdated', (data) => {
      setPoints(data.totalPoints);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return <div>Current Points: {points}</div>;
}
```

</details>

## 📊 Performance & Scalability

<div align="center">

### ⚡ Performance Metrics

</div>

<table>
<tr>
<td align="center">

**🔍 GET Endpoints**
< 50ms (cached)

</td>
<td align="center">

**📝 POST Endpoints**
< 100ms

</td>
<td align="center">

**🗄️ Database Queries**
< 200ms

</td>
<td align="center">

**🔌 WebSocket**
< 10ms latency

</td>
</tr>
</table>

### 🗄️ Caching Strategy

| Data Type | Cache Duration | Invalidation |
|-----------|----------------|--------------|
| 🎯 User Points | 5 minutes | On point changes |
| 🎁 Reward Options | 1 hour | Manual update |
| 📊 Analytics | 10 minutes | On new data |
| 📋 Transaction History | 2 minutes | On new transactions |

### 🚀 Production Optimizations

<details>
<summary>📖 Database Indexes</summary>

```javascript
// Recommended indexes for production
db.users.createIndex({ "userId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.rewards.createIndex({ "userId": 1 }, { unique: true })
db.transactions.createIndex({ "userId": 1, "timestamp": -1 })
db.transactions.createIndex({ "category": 1 })
db.redemptions.createIndex({ "userId": 1, "timestamp": -1 })
db.redemptions.createIndex({ "rewardType": 1 })
```

</details>

### 📈 Scalability Features
- ✅ **Horizontal Scaling** - Stateless architecture
- ✅ **Database Sharding** - Ready for MongoDB sharding
- ✅ **Load Balancing** - Multiple instance support
- ✅ **Cache Clustering** - Redis cluster compatible
- ✅ **Health Monitoring** - Built-in health checks

## 🛡️ Security & Best Practices

<div align="center">

### 🔐 Security Features

</div>

<table>
<tr>
<td align="center">

**✅ Input Validation**
class-validator schemas

</td>
<td align="center">

**🚫 Injection Prevention** 
MongoDB sanitization

</td>
<td align="center">

**🚨 Error Handling**
Sanitized error messages

</td>
<td align="center">

**⚡ Rate Limiting**
Ready for production

</td>
</tr>
</table>

### 🎯 Code Quality Standards

- ✅ **TypeScript** - Full type safety
- ✅ **ESLint** - Code quality enforcement  
- ✅ **Prettier** - Consistent formatting
- ✅ **Jest Testing** - 100% test coverage
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Validation** - Comprehensive input validation

## 🔄 CI/CD Pipeline

<details>
<summary>📖 GitHub Actions Example</summary>

```yaml
name: 🚀 Rewards API CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v3
        
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: 📦 Install dependencies
        run: npm ci
        
      - name: 🧪 Run tests
        run: npm run test:cov
        
      - name: 🏗️ Build application
        run: npm run build
        
      - name: 🧪 Run E2E tests
        run: npm run test:e2e
```

</details>

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
#
Develop by Prem with ❤️
