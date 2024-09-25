import { useState } from "react";
// import IdeaFormMain from "./IdeaForm-Main";
import IdeaForm from "./IdeaForm";
import IdeaList from "./IdeaList";
import ProfilePage from "./ProfilePage";

export default function App() {
  const [page, setPage] = useState("form");
  return (
    <div>
      {page === "home" && <IdeaList />}
      {page === "form" && <IdeaForm />}
      {page === "profile" && <ProfilePage />}
      {page === "home" && (
        <>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("form")}>New Idea </button>
        </>
      )}
    </div>
  );
}
