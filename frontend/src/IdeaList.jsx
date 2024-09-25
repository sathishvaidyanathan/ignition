import { useEffect, useState } from "react";

export default function IdeaList() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8081/api/ideas")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div style={{ padding: "50px" }}>
      <table border={1}>
        <thead>
          <td> Idea ID </td>
          <td> Idea Title </td>
          <td> Idea Description </td>
          <td> Idea Owner </td>
          <td> Submitted Date </td>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td> {d.id} </td>
              <td> {d.category} </td>
              <td> {d.description} </td>
              <td> {d.userlogin} </td>
              <td> {d.created_at} </td>
            </tr>
          ))}
        </tbody>
      </table>

      <input type="button" value="Add" />
    </div>
  );
}
