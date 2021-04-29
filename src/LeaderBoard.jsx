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
                <img alt="team" class="team" src={el.team} /> {el.name}
              </th>
              <td><code>{el.score}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
