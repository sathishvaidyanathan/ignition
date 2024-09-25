import React, { useEffect, useState } from 'react';
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
    background-color: #53565a; // Charcoal
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
  background-color: #ffffff;
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

const FormHeader = styled.h2`
  color: #f26522; // Pantone Orange
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

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState({
    full_name: '',
    about_me: '',
    profile_picture: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`http://localhost:4200/api/users/profile/${userId}`);
      const data = await response.json();
      setProfile(data);
    };

    fetchProfile();
  }, [userId]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('about_me', profile.about_me);
    if (file) {
      formData.append('profile_picture', file);
    }

    const response = await fetch(`http://localhost:4200/api/users/profile/${userId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      alert('Profile updated successfully!');
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
    } else {
      alert('Failed to update profile.');
    }
  };

  return (
    <PageWrapper>
      {/* Sidebar for Menu */}
      <Sidebar>
        <SidebarItem href="#home">Home</SidebarItem>
        <SidebarItem href="#ideas">My Ideas</SidebarItem>
        <SidebarItem href="#profile" onClick={() => setPage("form")}>
          Profile
        </SidebarItem>
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
          <div className="profile-page">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Profile Picture:</label>
                {profile.profile_picture && (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    width="100"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <label>Full Name:</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>About Me:</label>
                <textarea
                  value={profile.about_me}
                  onChange={(e) =>
                    setProfile({ ...profile, about_me: e.target.value })
                  }
                />
              </div>
              <button type="submit">Update Profile</button>
            </form>
          </div>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default ProfilePage;
