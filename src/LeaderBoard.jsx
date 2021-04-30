import React from 'react';

function App({data}) {
  return (
    <>
      <h3>Leader Board</h3>
      <table className="table">
        <tbody>
          {data.map((el) => (
            <tr key={el.name}>
              <th scope="row">
                {el.rank}
              </th>
              <td>
                <img alt="team" className="team" src={el.team} /> {el.name}
              </td>
              <td><code>{el.score}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
