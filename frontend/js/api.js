// API Configuration
const API_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API call failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, error);
        throw error;
    }
}

// Disaster APIs
const DisasterAPI = {
    getAll: () => apiCall('/disasters'),
    getById: (id) => apiCall(`/disasters/${id}`),
    create: (data) => apiCall('/disasters', 'POST', data),
    update: (id, data) => apiCall(`/disasters/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/disasters/${id}`, 'DELETE')
};

// Volunteer APIs
const VolunteerAPI = {
    getAll: () => apiCall('/volunteers'),
    getById: (id) => apiCall(`/volunteers/${id}`),
    create: (data) => apiCall('/volunteers', 'POST', data),
    update: (id, data) => apiCall(`/volunteers/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/volunteers/${id}`, 'DELETE')
};

// Allocation APIs
const AllocationAPI = {
    getRecommendations: (disasterId) => apiCall(`/allocation/recommend/${disasterId}`),
    assign: (disasterId, volunteerId) => apiCall('/allocation/assign', 'POST', { disasterId, volunteerId }),
    autoAssign: () => apiCall('/allocation/auto-assign', 'POST'),
    getAssignments: () => apiCall('/allocation/assignments')
};

// Analytics APIs
const AnalyticsAPI = {
    getDashboard: () => apiCall('/analytics/dashboard')
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DisasterAPI, VolunteerAPI, AllocationAPI, AnalyticsAPI };
}