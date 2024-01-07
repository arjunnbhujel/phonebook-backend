import React, { useEffect, useState, useMemo } from "react"
import personService from "./services/persons"
// import Alert from "./components/Alert";
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Person from "./components/Person"
import Notification from "./components/Notification"

const NOTIFICATION_TYPE = {
  NOTIFICATION: "notification",
  ERROR: "error",
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response)
      })
      .catch((error) => console.error(error))
  }, [])

  console.log(persons)

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        setNotification({
          text: `Contact ${newName} already exists.`,
          type: NOTIFICATION_TYPE.ERROR,
        })
      } else {
        const confirmUpdate = window.confirm(`Update ${newName}'s number?`)
        if (confirmUpdate) {
          const updatedPerson = { ...existingPerson, number: newNumber }
          personService
            .update(existingPerson.id, updatedPerson)
            .then((response) => {
              setPersons((prevPersons) =>
                prevPersons.map((person) =>
                  person.id === existingPerson.id ? response : person
                )
              )
              setNotification({
                text: `${newName}'s number was updated.`,
                type: NOTIFICATION_TYPE.NOTIFICATION,
              })
            })
            .catch((error) => {
              console.error(error)
              setNotification({
                text: "Error updating contact.",
                type: NOTIFICATION_TYPE.ERROR,
              })
            })
        }
      }
    } else {
      const nameObject = { name: newName, number: newNumber }
      personService
        .create(nameObject)
        .then((response) => {
          setPersons([...persons, response])
          setNotification({
            text: `${newName} added to the phonebook.`,
            type: NOTIFICATION_TYPE.NOTIFICATION,
          })
        })
        .catch((error) => {
          console.error(error)
          setNotification({
            text: error.response.data.error,
            type: NOTIFICATION_TYPE.ERROR,
          })
        })
    }

    setNewName("")
    setNewNumber("")
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id)
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`)

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          )
          setNotification({
            text: `${personToDelete.name} was deleted from the phonebook.`,
            type: NOTIFICATION_TYPE.NOTIFICATION,
          })
        })
        .catch((error) => {
          console.error(error)
          setNotification({
            text: "Error deleting contact.",
            type: NOTIFICATION_TYPE.ERROR,
          })
        })
    }
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = useMemo(() => {
    return filter
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
      : persons
  }, [persons, filter])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add New</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Person persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
