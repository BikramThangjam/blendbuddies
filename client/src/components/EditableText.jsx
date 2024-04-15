import React, { useState } from "react";
import { TextField, Typography, useTheme, Box } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { API_URL } from "../config";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../reducers";

const EditableText = ({ text, socialPlatform }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const medium = palette.neutral.main;
  const main = palette.neutral.main;

  const handleInputChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditEnd = async () => {
    setIsEditing(false);
   
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialPlatform,
          profileUrl: editedText,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update social profile URL: ${response.statusText}`
        );
      }

      const updatedText = await response.json();
      // const {socialProfileUrl} = updatedText;
      // console.log(socialProfileUrl);
      dispatch(setUserProfile(updatedText));
    } catch (error) {
      console.error("Error updating social profile URL:", error);
      // Handle error appropriately, e.g., show error message to the user
    }
  };

  return (
    <FlexBetween gap="1rem" mb="0.5rem">
      <FlexBetween gap="1rem">
        <img src="../assets/twitter.png" alt="twitter" />
        <Box>
          <Typography color={main} fontWeight="500">
            {/* Capitalize first letter of a word */}
            {`${socialPlatform.charAt(0).toUpperCase()}${socialPlatform.slice(1)}` } 
          </Typography>

          <FlexBetween gap="4rem">
            {isEditing ? (
              <TextField
                variant="standard"
                value={editedText}
                onChange={handleInputChange}
                onBlur={handleEditEnd}
              />
            ) : (
              <Typography
                color={medium}
                fontWeight="500"
                onDoubleClick={handleEditStart}
              >
                {text}
              </Typography>
            )}
            <EditOutlined sx={{ color: medium }} onClick={handleEditStart} />
          </FlexBetween>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default EditableText;
