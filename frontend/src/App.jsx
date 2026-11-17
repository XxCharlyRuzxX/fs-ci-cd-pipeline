import { useState, useEffect } from "react";
import {
  getAllPersons,
  createPerson,
  deletePerson,
  updatePerson,
} from "./services/persons.js";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState([null, String]);
  const [filter, setFilter] = useState("");

  const handleNotificationSuccess = (message) => {
    setNotification([message, "notification-success"]);
    setTimeout(() => {
      setNotification([null, String]);
    }, 5000);
  };

  const handleNotificationError = (message) => {
    setNotification([message, "notification-error"]);
    setTimeout(() => {
      setNotification([null, String]);
    }, 5000);
  };

  useEffect(() => {
    getAllPersons()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.error("Error fetching persons:", error);
        handleNotificationError("Failed to fetch persons from the server.");
      });
  }, []);

  const clearInputFields = () => {
    setNewName("");
    setNewNumber("");
  };

  const handleformSubmit = (event) => {
    event.preventDefault();
    const personToUpdate = persons.find((person) => person.name === newName);
    if (personToUpdate?.number === newNumber) {
      alert(`${newName} is already added to phonebook`);
      clearInputFields();
      return;
    }
    if (personToUpdate) {
      const confirmPut = window.confirm(
        `User is already in the phonebook. Are you sure you want to update their number?`,
      );
      if (confirmPut) {
        updatePerson(personToUpdate.id, {
          name: newName,
          number: newNumber,
        })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === personToUpdate.id ? updatedPerson : person,
              ),
            );
            handleNotificationSuccess(
              `Updated ${newName}'s number successfully`,
            );
          })
          .catch((error) => {
            handleNotificationError(
              error.response?.data?.error || `Error updating ${newName}`,
            );
          });
      } else {
        alert(`${newName} is already added to phonebook`);
      }
      clearInputFields();
    } else {
      createPerson({ name: newName, number: newNumber })
        .then((returnedPerson) => {
          console.log("entre al then en createperson")
          setPersons(persons.concat(returnedPerson));
          handleNotificationSuccess(`Added ${newName} successfully`);
        })
        .catch((error) => {
                    console.log("entre al catch en createperson")
          handleNotificationError(
            error.response?.data?.error || `Error adding ${newName}`,
          );
        });
      clearInputFields();
    }
  };

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (personToDelete) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${personToDelete.name}?`,
      );
      if (confirmDelete) {
        deletePerson(id)
          .then(() => {
            setPersons(persons.filter((person) => person.id !== id));
            handleNotificationSuccess(
              `Deleted ${personToDelete.name} successfully`,
            );
          })
          .catch((error) => {
            handleNotificationError(
              error.response?.data?.error ||
                `Error deleting ${personToDelete.name}`,
            );
          });
      }
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && (
        <Notification message={notification[0]} className={notification[1]} />
      )}
      <p>filter shown with</p>
      <Filter
        filter={filter}
        handlefilterChange={(e) => setFilter(e.target.value)}
      />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        handleformSubmit={handleformSubmit}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filter={filter}
        onDelete={handleDeletePerson}
      />
    </div>
  );
};

export default App;
