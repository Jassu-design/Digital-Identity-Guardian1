import api from './axios.js'

export const getOrganization = async () => {
  const response = await api.get(
    '/organizations',
  )

  return response.data
}

export const createOrganization = async data => {
  const response = await api.post(
    '/organizations',
    data,
  )

  return response.data
}

export const updateOrganization = async data => {
  const response = await api.patch(
    '/organizations',
    data,
  )

  return response.data
}