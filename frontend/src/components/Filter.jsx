const Filter = ({ filter, handlefilterChange }) => {
  return (
    <div>
      filter: <input value={filter} onChange={handlefilterChange} />
    </div>
  );
};

export default Filter;
