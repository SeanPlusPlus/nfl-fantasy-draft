import React from 'react';

function App({data}) {
  return (
    <>
      <h3>Remaining: {data.length}</h3>
      <ul>
        {data.map((el) => (
          <li key={el.name}>{el.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
