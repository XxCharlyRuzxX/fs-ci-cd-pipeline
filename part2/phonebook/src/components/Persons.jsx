const Persons = ({ persons, filter , onDelete}) => {
  return (
    <div>
        {persons
          .filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase()),
          )
          .map((person) => (
          <div key={person.id}>
            <p>
              {person.name} {person.number}
            </p>
            <button type="button" onClick={() => onDelete(person.id)}>delete</button>
          </div>
          ))}
    </div>
  )
}

export default Persons