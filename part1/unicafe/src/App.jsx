import { useState } from "react";

const Stadistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StadisticsLine text="good" value={good} />
        <StadisticsLine text="neutral" value={neutral} />
        <StadisticsLine text="bad" value={bad} />
        <StadisticsLine text="all" value={total} />
        <StadisticsLine text="average" value={average} />
        <StadisticsLine text="positive" value={`${positive.toFixed(1)} %`} />
      </tbody>
    </table>
  );
};

const StadisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <h1>Statistics</h1>
      <Stadistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
