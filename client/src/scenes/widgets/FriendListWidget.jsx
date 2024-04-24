import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedFriends} from "../../reducers";
import { API_URL } from "../../config";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector(state => state.user._id);
  const [friends, setFriends] = useState(userId === loggedInUserId ? useSelector(state.user.friends) : []);

  const getFriends = async () => {
    const response = await fetch(`${API_URL}/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setFriends(data);
  };

  const getFriendSuggestions = async () => {
    const response = await fetch(`${API_URL}/users/${loggedInUserId}/suggestions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (response.ok) {
      const data = await response.json();
      dispatch(setSuggestedFriends({ suggestedFriends: data }));
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper
        sx={{
          overflowY: "auto",
          maxHeight: "370px", // Adjust the max height as needed
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for Webkit-based browsers
          },
      }}
    >
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      {friends?.length > 0 ? (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              getFriendSuggestions={getFriendSuggestions}
              getFriends={getFriends}
            />
          ))}
        </Box>
      ) : (
        <Typography fontSize="0.7rem">No friends to show</Typography>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
