import { useState, useEffect } from 'react'
import personService from './personService'

const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}
const Filter = ({filterName, handleFilterChange}) => (
  <div>
    filter shown with<input value={filterName} onChange={handleFilterChange} />
  </div>
)
const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    {/*<div>debug: {newName}</div>*/}
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
const Persons = ({persons, filterName, deletePerson}) => (
  <>
    {persons.filter((person) => person.name.toLowerCase().includes(filterName.toLowerCase()))
    .map((person) => (
      <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></p>
    ))}
  </>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState({message: null})

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName, number: newNumber
    }
    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        newPerson.id = persons.find(p => p.name === newName).id
        personService.update(newPerson.id, newPerson)
          .then((data) => {
            setPersons(persons.map(p => p.id !== newPerson.id ? p : data))
            setNotification({message: `The number of ${newName} was updated`, color: 'green'})
            setTimeout(() => setNotification({message: null}), 5000)
          })
          .catch(error => {
            // setNotification({message: `Information of ${newName} has already been removed from server`, color: 'red'})
            console.log(error.response.data)
            setNotification({message: error.response.data.error, color: 'red'})
            setTimeout(() => setNotification({message: null}), 5000)
          })
      }
      return
    }
    personService.create(newPerson)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        setNotification({message: `Added ${newName}`, color: 'green'})
        setTimeout(() => setNotification({message: null}), 5000)
      },
      error => {
        console.log(error.response.data)
        setNotification({message: error.response.data.error, color: 'red'})
        setTimeout(() => setNotification({message: null}), 5000)
      })
  }
  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.erase(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id))
          setNotification({message: `Deleted ${person.name}`, color: 'green'})
          setTimeout(() => setNotification({message: null}), 5000)
        })
        .catch(error => {
          setNotification({message: `The person ${person.name} was already deleted from server`, color: 'red'})
          setTimeout(() => setNotification({message: null}), 5000)
        })
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} color={notification.color} />
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filterName={filterName} deletePerson={deletePerson} />
    </div>
  )

}

export default App