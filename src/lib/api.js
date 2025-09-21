const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Projects API
export const projectsAPI = {
  // Get all projects
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/projects?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Get single project
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  // Create new project
  create: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  // Update project
  update: async (id, projectData) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  // Delete project
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
  },
};

// Raw Materials API
export const rawMaterialsAPI = {
  // Get all raw materials
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/raw-materials`);
    if (!response.ok) throw new Error('Failed to fetch raw materials');
    return response.json();
  },

  // Update raw material
  update: async (id, materialData) => {
    const response = await fetch(`${API_BASE_URL}/api/raw-materials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });
    if (!response.ok) throw new Error('Failed to update raw material');
    return response.json();
  },
};

// Weavers API
export const weaversAPI = {
  // Get all weavers
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/weavers`);
    if (!response.ok) throw new Error('Failed to fetch weavers');
    return response.json();
  },
};

