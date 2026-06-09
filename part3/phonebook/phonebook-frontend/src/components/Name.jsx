const Name = ({ name, deleteName }) => {
  const label = "Delete";

  return (
    <li>
      {name.name} - {name.number}
      <button onClick={deleteName}>{label}</button>
    </li>
  );
};

export default Name;
