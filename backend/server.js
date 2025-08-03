const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage (replace with database later)
let projects = [
  {
    id: '1',
    type: 'Saree',
    name: 'Banarasi Wedding Saree',
    remarks: 'Traditional handwoven silk with zari work',
    deadline: '2024-12-31',
    currentStage: 'Weaving',
    rawMaterials: [
      { id: '1', name: 'Silk Yarn', quantity: 500, unit: 'g' },
      { id: '2', name: 'Zari Thread', quantity: 200, unit: 'g' }
    ],
    startDate: '2024-01-15',
    lastWorkedOn: '2024-01-20',
    totalTimeLogged: 50400, // 14 hours in seconds
    isActive: false
  }
];

let rawMaterials = [
  { id: '1', name: 'Royal Purple Silk', quantity: 500, unit: 'g' },
  { id: '2', name: 'Zari Gold Thread', quantity: 200, unit: 'g' },
  { id: '3', name: 'Emerald Silk', quantity: 300, unit: 'g' },
  { id: '4', name: 'Crimson Cotton', quantity: 400, unit: 'g' },
  { id: '5', name: 'Sapphire Wool', quantity: 250, unit: 'g' },
  { id: '6', name: 'Amber Linen', quantity: 350, unit: 'g' }
];

let items = [];

// Helper function to generate unique IDs
const generateId = () => Date.now().toString();

// PROJECTS ENDPOINTS

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create new project
app.post('/api/projects', (req, res) => {
  const newProject = {
    id: generateId(),
    ...req.body,
    startDate: new Date().toISOString().split('T')[0],
    totalTimeLogged: 0,
    isActive: false
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  projects[index] = { ...projects[index], ...req.body };
  res.json(projects[index]);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  projects.splice(index, 1);
  res.status(204).send();
});

// Update project stage
app.patch('/api/projects/:id/stage', (req, res) => {
  const { currentStage } = req.body;
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.currentStage = currentStage;
  res.json(project);
});

// Update project timer
app.patch('/api/projects/:id/timer', (req, res) => {
  const { totalTimeLogged, isActive, lastWorkedOn } = req.body;
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.totalTimeLogged = totalTimeLogged;
  project.isActive = isActive;
  if (lastWorkedOn) project.lastWorkedOn = lastWorkedOn;
  res.json(project);
});

// RAW MATERIALS ENDPOINTS

// Get all raw materials
app.get('/api/raw-materials', (req, res) => {
  res.json(rawMaterials);
});

// Get single raw material
app.get('/api/raw-materials/:id', (req, res) => {
  const material = rawMaterials.find(m => m.id === req.params.id);
  if (!material) {
    return res.status(404).json({ error: 'Raw material not found' });
  }
  res.json(material);
});

// Create new raw material
app.post('/api/raw-materials', (req, res) => {
  const newMaterial = {
    id: generateId(),
    ...req.body
  };
  rawMaterials.push(newMaterial);
  res.status(201).json(newMaterial);
});

// Update raw material
app.put('/api/raw-materials/:id', (req, res) => {
  const index = rawMaterials.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Raw material not found' });
  }
  rawMaterials[index] = { ...rawMaterials[index], ...req.body };
  res.json(rawMaterials[index]);
});

// Delete raw material
app.delete('/api/raw-materials/:id', (req, res) => {
  const index = rawMaterials.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Raw material not found' });
  }
  rawMaterials.splice(index, 1);
  res.status(204).send();
});

// Update stock quantity
app.patch('/api/raw-materials/:id/stock', (req, res) => {
  const { quantity } = req.body;
  const material = rawMaterials.find(m => m.id === req.params.id);
  if (!material) {
    return res.status(404).json({ error: 'Raw material not found' });
  }
  material.quantity = quantity;
  res.json(material);
});

// ITEMS ENDPOINTS

// Get all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// Create new item
app.post('/api/items', (req, res) => {
  const newItem = {
    id: generateId(),
    ...req.body
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(index, 1);
  res.status(204).send();
});

// UTILITY ENDPOINTS

// Get low stock notifications
app.get('/api/notifications/low-stock', (req, res) => {
  const lowStockThreshold = 100; // grams
  const lowStockItems = rawMaterials.filter(material => 
    material.quantity < lowStockThreshold
  );
  res.json(lowStockItems);
});

// Get surplus items (for marketplace)
app.get('/api/marketplace/surplus', (req, res) => {
  const surplusThreshold = 1000; // grams
  const surplusItems = rawMaterials.filter(material => 
    material.quantity > surplusThreshold
  );
  res.json(surplusItems);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Looma Backend Server running on port ${PORT}`);
  console.log(`📊 API Documentation:`);
  console.log(`   Projects: http://localhost:${PORT}/api/projects`);
  console.log(`   Raw Materials: http://localhost:${PORT}/api/raw-materials`);
  console.log(`   Items: http://localhost:${PORT}/api/items`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
}); 