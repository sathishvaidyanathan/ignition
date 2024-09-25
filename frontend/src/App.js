import React from "react";
import IdeaForm from "./IdeaForm-Main";

function App() {
  return (
    <div className="App">
      <IdeaForm />
      <ProfilePage userId={1} />
    </div>
  );
}

export default App;
