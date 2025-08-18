import axios from 'axios'
import { useAuthStore } from '@/state/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:64001/api'
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  console.log('🔑 API Request:', {
    url: config.url,
    baseURL: config.baseURL,
    hasToken: !!token,
    tokenLength: token?.length || 0
  })
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)
