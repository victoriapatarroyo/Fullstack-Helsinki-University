import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api";

const CountryDetail = ({ country, onBack }) => (
  <div>
    <button onClick={onBack}>← Volver</button>
    <h2>{country.name.common}</h2>
    <p>
      <strong>Capital:</strong> {country.capital?.join(", ")}
    </p>
    <p>
      <strong>Área:</strong> {country.area?.toLocaleString()} km²
    </p>
    <p>
      <strong>Población:</strong> {country.population?.toLocaleString()}
    </p>
    <p>
      <strong>Región:</strong> {country.region}
    </p>
    <strong>Idiomas:</strong>
    <ul>
      {Object.values(country.languages ?? {}).map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img
      src={country.flags?.svg}
      alt={`Bandera de ${country.name.common}`}
      width={200}
    />
  </div>
);

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/all`).then((res) => setCountries(res.data));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? countries.filter((c) => c.name.common.toLowerCase().includes(q))
    : [];

  if (selected) {
    return (
      <CountryDetail country={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <div>
      <h1>Países del Mundo</h1>
      Find countries:{" "}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
      />
      {filtered.length > 10 && <p>Demasiados resultados, sé más específico.</p>}
      {filtered.length > 1 && filtered.length <= 10 && (
        <ul>
          {filtered.map((c) => (
            <li key={c.cca3}>
              {c.name.common}{" "}
              <button onClick={() => setSelected(c)}>Ver</button>
            </li>
          ))}
        </ul>
      )}
      {filtered.length === 1 && (
        <CountryDetail country={filtered[0]} onBack={() => setQuery("")} />
      )}
    </div>
  );
};

export default App;
