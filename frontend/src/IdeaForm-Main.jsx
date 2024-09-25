import React, { useState, useEffect} from "react";
import styled from "styled-components";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

// Styled components for UI
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #333; // Dark background for the sidebar
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SidebarItem = styled.a`
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #53565A; // Charcoal
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5; // Light background for main content
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-image: url("./src/acv-fallback.svg");
  background-repeat: repeat-x;
  background-size: cover; // This ensures the image repeats horizontally like a banner
  background-position: center;
  height: 150px; // Adjust height as needed
`;

const Logo = styled.img`
  height: 160px;
  margin-right: 20px;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #FFFFFF;
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-family: "Proxima Nova", sans-serif;
  color: #ffffff; // Pantone Orange
  margin: 0;
  font-size: 36px;
`;

const PostDescription = styled.h4`
  font-family: "Montserrat", sans-serif;
  color: #000000; 
  font-size: 14px;
`;

const FormHeader = styled.h2`
  color: #F26522; // Pantone Orange
  text-align: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-family: "Proxima Nova", sans-serif;
  color: #000000;
  margin-top: 10px;
  display: block;
`;

const TextArea = styled.textarea`
  width: 90%;
  height: 50px;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 12px;
  resize: none;
`;

const PostButton = styled.button`
  background-color: #ff9e1b; // Pantone Orange
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  display: block;
  width: 100px;
  text-align: center;

  &:hover {
    background-color: #e65a00; // Darker orange for hover effect
  }
`;

const Dropdown = styled.select`
  width: 94%;
  padding: 10px;
  font-size: 12px;
  font-family: "Proxima Nova";
  border: 1px solid #000000;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const Message = styled.p`
  color: green;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

// Constants for category options
const categories = [
  "Process Optimisation",
  "Product Feature",
  "Technical Improvement",
  "Business Model",
  "Workplace Suggestion",
];


// Main component
const IdeaForm = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [selectedReactions, setSelectedReactions] = useState({}); // Track reactions for each idea
  const [message, setMessage] = useState("");

  // Fetch ideas from the server
  useEffect(() => {
    fetch("http://localhost:8081/ideas")
      .then((response) => response.json())
      .then((data) => {
        setIdeas(data);
      })
      .catch((error) => {
        console.error("Error fetching ideas:", error);
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const ideaData = {
      description,
      category,
      hashtags: hashtags.join(","),
    };

    // Post idea to server
    fetch("http://localhost:8081/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ideaData),
    })
      .then(() => {
        // Reset fields after submission
        setDescription("");
        setCategory("");
        setHashtags([]);
        setIdeas([...ideas, ideaData]); // Optimistically update ideas
      })
      .catch((error) => {
        console.error("Error submitting idea:", error);
      });
  };

   // Handle reaction for a specific idea
  const handleReaction = (ideaId, reaction) => {
    setSelectedReactions((prevReactions) => ({
      ...prevReactions,
      [ideaId]: reaction,
    }));
  };

  return (
    <PageWrapper>
      {/* Sidebar for Menu */}
      <Sidebar>
        <SidebarItem href="#home">Home</SidebarItem>
        <SidebarItem href="#ideas">My Ideas</SidebarItem>
        <SidebarItem href="#leaderboard">Leaderboard</SidebarItem>
        <SidebarItem href="#profile">Profile</SidebarItem>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Header with Logo */}
        <Header>
          <Logo src="./src/ignition.gif" alt="Logo" />
          <Title>Ignition</Title>
        </Header>

        {/* Idea Form */}
        <Container>
          <FormHeader>Ignite Your Idea</FormHeader>
          <form onSubmit={handleSubmit}>
            {/* Text Area */}
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Everything you imagine is real. Ignite  your idea here..."
            />

            {/* Dropdown for Categories */}
            <Label>Idea Category</Label>
            <Dropdown
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </Dropdown>

            {/* Hashtag Input with react-tagsinput */}
            <Label>Enter Hashtags</Label>
            <TagsInput
              value={hashtags}
              onChange={(tags) => setHashtags(tags)}
              inputProps={{ placeholder: "Add hashtag" }}
            />

            {/* Submit Button */}
            <PostButton type="submit">Ignite !</PostButton>
          </form>

          <div className="ideas-list">
            {ideas.map((idea) => (
              <div key={idea.id} className="idea-card">
                <div className="idea-body">
                  <PostDescription>{idea.description}</PostDescription>
                  <div className="hashtags">
                    {idea.hashtags &&
                      idea.hashtags.split(",").map((tag) => (
                        <span key={tag} className="hashtag">
                          #{tag.trim()}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="idea-reactions">
                  <button onClick={() => handleReaction(idea.id, "LOVED")}>
                    ❤️ Loved
                  </button>
                  <button onClick={() => handleReaction(idea.id, "LIKED")}>
                    👍 Liked
                  </button>
                  <button onClick={() => handleReaction(idea.id, "INSPIRED")}>
                    ✨ Inspired
                  </button>
                  <span className="selected-reaction">
                    {selectedReactions[idea.id] &&
                      `You reacted with: ${selectedReactions[idea.id]}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {message && <Message>{message}</Message>}
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default IdeaFormMain;
