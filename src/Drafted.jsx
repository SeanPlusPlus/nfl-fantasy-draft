import React from 'react';

function App({data}) {
  return (
    <>
      <h3>Drafted</h3>
      <ol>
        {data.map((el) => (
          <li key={el}>{el}</li>
        ))}
      </ol>
    </>
  );
}

export default App;
