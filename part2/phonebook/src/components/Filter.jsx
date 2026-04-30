const Filter = ({ filter, onChange }) => {
  return (
    <div>
      Search: <input value={filter} onChange={onChange} />
    </div>
  );
};

export default Filter;
