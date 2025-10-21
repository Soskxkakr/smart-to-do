import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
// GET all tasks
export const getTasks = () => api.get('/tasks').then(res => res.data);

// GET task by id
export const getTask = (id: number) => api.get(`/tasks/${id}`).then(res => res.data);

// POST create new task
export const createTask = (task: any) => api.post('/tasks', task).then(res => res.data);

// PUT update task
export const updateTask = (id: number, task: any) => api.put(`/tasks/${id}`, task).then(res => res.data);

// PATCH partial update task
export const patchTask = (id: number, updates: any) => api.patch(`/tasks/${id}`, updates).then(res => res.data);

// DELETE task
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`).then(res => res.data);
