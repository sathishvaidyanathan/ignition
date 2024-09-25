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
  margin-left: 0px;
`;


const Logo = styled.img`
  height: 160px;
  margin-right: 20px;
  margin-left: 280px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center; /* Aligns the icon and description vertically */
`;

const CategoryIcon = styled.img`
  width: 40px; /* Size the icon */
  height: 40px;
  margin-right: 10px; /* Add some space between the icon and the text */
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
  color: #FFFFFF; 
  margin: 0;
  font-size: 36px;
`;

const FormHeader = styled.h2`
  color: #F26522; // Pantone Orange
  text-align: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: #f26522;
  margin-top: 10px;
  display: block;
`;

const PostDescription = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #000000;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  border: 1px solid #e0e0e0;
  max-width: 600px;
  word-wrap: break-word;
`;

const HashTagStyle = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #3498db;
  font-size: 14px;
  padding: 16px; /* Padding inside the box */
  word-wrap: break-word; /* Ensures long words wrap properly */
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
  font-family: "Montserrat", sans-serif;
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
  "Select One",
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
  const [userlogin, setUserlogin] = useState("");
  const [created_at, setCreatedAt] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [selectedReactions, setSelectedReactions] = useState({}); // Track reactions for each idea
  const [message, setMessage] = useState("");
  const [reactionsCount, setReactionsCount] = useState({});

  const formatDateToEST = (utcDateString) => {
    const date = new Date(utcDateString);

    return date.toLocaleString("en-US", {
      timeZone: "America/New_York", // For EST timezone
      year: "numeric",
      month: "short", // 'Jan', 'Feb', etc.
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
  };

  // Fetch ideas from the server
  useEffect(() => {
    fetch("http://localhost:8081/ideas")
      .then((response) => response.json())
      .then((data) => {
        setIdeas(data);

        // Fetch reactions for each idea
        data.forEach((idea) => {
          fetchReactions(idea.id);
        });
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
      userlogin,
      created_at,
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
        setUserlogin("");
        setCreatedAt("");
        // Optimistically add new idea at the top of the list
        setIdeas([ideaData, ...ideas]);
      })
      .catch((error) => {
        console.error("Error submitting idea:", error);
      });
  };

  /*
  // Handle reaction for a specific idea
  const handleReaction = (ideaId, reaction) => {
    setSelectedReactions((prevReactions) => ({
      ...prevReactions,
      [ideaId]: reaction,
    }));
  };
*/

const getIconForCategory = (category) => {
  switch (category) {
    case "Product Feature":
      return "product.png"; // Replace with the actual path to your icon
    case "Workplace Suggestion":
      return "workplace.svg";
    case "Business Model":
      return "business.svg";
    case "Technical Improvement":
      return "technology.png";
    case "Process Optimisation":
      return "process.svg";
    default:
      return "/icons/default.svg"; // Fallback icon
  }
};

  // Fetch reactions count for an idea
  const fetchReactions = (ideaId) => {
    fetch(`http://localhost:8081/ideas/${ideaId}/reactions`)
      .then((response) => response.json())
      .then((data) => {
        setReactionsCount((prev) => ({
          ...prev,
          [ideaId]: {
            LOVED:
              data.find((reaction) => reaction.reaction_type === "LOVED")
                ?.count || 0,
            LIKED:
              data.find((reaction) => reaction.reaction_type === "LIKED")
                ?.count || 0,
            INSPIRED:
              data.find((reaction) => reaction.reaction_type === "INSPIRED")
                ?.count || 0,
          },
        }));
      })
      .catch((error) => console.error("Error fetching reactions:", error));
  };

  const handleReaction = async (ideaId, reaction) => {

    try {
      const userlogin = "tswift"; // Replace this with the actual logged-in user

      // Log payload being sent to the server
      console.log("Sending reaction:", { userlogin, reaction });

      const response = await fetch(
        `http://localhost:8081/ideas/${ideaId}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userlogin, reaction }),
        }
      );

      if (response.ok) {
        console.log("Reaction recorded successfully!");

        // Optimistically update the reaction count on the frontend
        setReactionsCount((prev) => ({
          ...prev,
          [ideaId]: {
            ...prev[ideaId],
            [reaction]: (prev[ideaId]?.[reaction] || 0) + 1,
          },
        }));
        
      } else {
        const errorMsg = await response.text();
        console.error("Error details:", errorMsg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <PageWrapper>
      {/* Sidebar for Menu 
      <Sidebar>
        <SidebarItem href="#home">Home</SidebarItem>
        <SidebarItem href="#profile">Profile</SidebarItem>
      </Sidebar>
      */}

      {/* Main Content */}
      <MainContent>
        {/* Header with Logo */}
        <Header>
          <Logo src="./src/ignition.gif" alt="Logo" />
          <Title>Ignition</Title>
        </Header>

        {/* Idea Form */}
        <Container>
          <Label>Ignite Your Idea</Label>
          <form onSubmit={handleSubmit}>
            {/* Text Area */}
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Everything you imagine is real. Ignite your idea here..."
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
            {/* Separation between ideas */}
            <br></br>
            <hr className="idea-divider" />

            {ideas.map((idea) => (
              <div key={idea.id} className="idea-container">
                <div className="idea-card">
                  <div className="idea-body">
                    <PostDescription>
                      <IconContainer>
                        <CategoryIcon
                          src={getIconForCategory(idea.category)}
                          alt={idea.category}
                        />
                        {idea.description}
                        <HashTagStyle>
                          <div className="hashtags">
                            {idea.hashtags &&
                              idea.hashtags.split(",").map((tag) => (
                                <span key={tag} className="hashtag">
                                  #{tag.trim()}{" "}
                                </span>
                              ))}
                          </div>
                        </HashTagStyle>
                      </IconContainer>
                    </PostDescription>
                  </div>

                  <div className="idea-reactions">
                    <button onClick={() => handleReaction(idea.id, "LOVED")}>
                      ❤️ {reactionsCount[idea.id]?.LOVED || 0}
                    </button>
                    <button onClick={() => handleReaction(idea.id, "LIKED")}>
                      🚨 {reactionsCount[idea.id]?.LIKED || 0}
                    </button>
                    <button onClick={() => handleReaction(idea.id, 'INSPIRED')}>
                      🚀 {reactionsCount[idea.id]?.INSPIRED || 0}
                    </button>

                    <span className="selected-reaction">
                      {selectedReactions[idea.id] &&
                        `${selectedReactions[idea.id]}`}
                    </span>
                  </div>
                  <p>
                    <i>
                      ignited by {idea.userlogin} on{" "}
                      {formatDateToEST(idea.created_at)} EST
                    </i>
                  </p>
                </div>
                {/* Separation between ideas */}
                <hr className="idea-divider" />
              </div>
            ))}
          </div>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default IdeaForm;