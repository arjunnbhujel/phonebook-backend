import axios from "axios"
const baseUrl = "api/persons"

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`)
  }
}

const create = async (nameObject) => {
  try {
    const response = await axios.post(baseUrl, nameObject)
    return response.data
  } catch (error) {
    throw new Error(`Error creating data: ${error.message}`)
  }
}

const update = async (id, nameObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, nameObject)
    return response.data
  } catch (error) {
    throw new Error(`Error updating data: ${error.message}`)
  }
}

const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    throw new Error(`Error deleting data: ${error.message}`)
  }
}

const personService = {
  getAll,
  create,
  update,
  remove,
}

export default personService
