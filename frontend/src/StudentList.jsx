import { useEffect, useState } from "react";

export default function StudentList() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8081/students")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div style={{ padding: "50px" }}>
      <table border={1}>
        <thead>
          <td> Student ID </td>
          <td> Student Name </td>
          <td> Date </td>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td> {d.STUDENTID} </td>
              <td> {d.NAME} </td>
              <td> {d.UPDATED_TS} </td>
            </tr>
          ))}
        </tbody>
      </table>

      <input type="button" value="Add" />
    </div>
  );
}
