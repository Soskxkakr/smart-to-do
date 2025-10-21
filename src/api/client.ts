import axios from 'axios';
import { type Task } from "@/types";

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
// GET all tasks
export const getTasks = () => api.get('/tasks').then(res => res.data);

// GET task by id
export const getTask = (id: string) => api.get(`/tasks/${id}`).then(res => res.data);

// POST create new task
export const createTask = (task: any) => api.post('/tasks', task).then(res => res.data);

// PUT update task
export const updateTask = (id: string, task: Task) => api.put(`/tasks/${id}`, task).then(res => res.data);

// PATCH partial update task
export const patchTask = (id: string, newTask: Task) => api.patch(`/tasks/${id}`, newTask).then(res => res.data);

// DELETE task
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`).then(res => res.data);
