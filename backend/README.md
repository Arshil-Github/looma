# Looma Backend API

A simple Express.js backend for the Looma handloom artisan dashboard.

## Features

- **Projects Management**: Create, read, update, delete projects with stages and timers
- **Raw Materials Management**: Manage yarn inventory with stock tracking
- **Items Management**: Track completed items with photos and costs
- **Low Stock Notifications**: Get alerts for materials running low
- **Surplus Marketplace**: Identify materials available for sale

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

3. **Server will run on:** `http://localhost:3001`

## API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/stage` - Update project stage
- `PATCH /api/projects/:id/timer` - Update project timer

### Raw Materials

- `GET /api/raw-materials` - Get all raw materials
- `GET /api/raw-materials/:id` - Get single raw material
- `POST /api/raw-materials` - Create new raw material
- `PUT /api/raw-materials/:id` - Update raw material
- `DELETE /api/raw-materials/:id` - Delete raw material
- `PATCH /api/raw-materials/:id/stock` - Update stock quantity

### Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Utilities

- `GET /api/notifications/low-stock` - Get low stock notifications
- `GET /api/marketplace/surplus` - Get surplus items for marketplace
- `GET /api/health` - Health check

## Data Models

### Project
```json
{
  "id": "string",
  "type": "string",
  "name": "string",
  "remarks": "string",
  "deadline": "YYYY-MM-DD",
  "currentStage": "Preparation|Preweaving|Weaving|Finishings|Completed",
  "rawMaterials": [
    {
      "id": "string",
      "name": "string",
      "quantity": "number",
      "unit": "string"
    }
  ],
  "startDate": "YYYY-MM-DD",
  "lastWorkedOn": "YYYY-MM-DD",
  "totalTimeLogged": "number (seconds)",
  "isActive": "boolean"
}
```

### Raw Material
```json
{
  "id": "string",
  "name": "string",
  "quantity": "number",
  "unit": "string"
}
```

### Item
```json
{
  "id": "string",
  "photo": "string (URL)",
  "name": "string",
  "material": "string",
  "color": "string",
  "quantity": "number",
  "totalCost": "number"
}
```

## Example Usage

### Create a new project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Saree",
    "name": "Banarasi Wedding Saree",
    "remarks": "Traditional handwoven silk with zari work",
    "deadline": "2024-12-31",
    "currentStage": "Preparation",
    "rawMaterials": [
      {"name": "Silk Yarn", "quantity": 500, "unit": "g"},
      {"name": "Zari Thread", "quantity": 200, "unit": "g"}
    ]
  }'
```

### Update project stage
```bash
curl -X PATCH http://localhost:3001/api/projects/1/stage \
  -H "Content-Type: application/json" \
  -d '{"currentStage": "Weaving"}'
```

### Update raw material stock
```bash
curl -X PATCH http://localhost:3001/api/raw-materials/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity": 450}'
```

## Next Steps

1. **Database Integration**: Replace in-memory arrays with a proper database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add user authentication and authorization
3. **File Upload**: Add image upload functionality for items
4. **Real-time Updates**: Add WebSocket support for real-time timer updates
5. **Validation**: Add input validation and sanitization
6. **Error Handling**: Improve error handling and logging 