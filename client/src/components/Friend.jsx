import {
    PersonAddOutlined,
    PersonRemoveOutlined
} from "@mui/icons-material";
import {Box, Icon, IconButton, Typography, useTheme} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link  } from "react-router-dom";
import { setFriends } from "../reducers";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

import React from 'react'
import { API_URL } from "../config";

function Friend({friendId, name, subtitle, userPicturePath, getFriendSuggestions, getFriends}) {
    
    const dispatch = useDispatch();
    const location = useLocation();
    const isProfileRoute = location.pathname.includes("/profile/");

    const {_id} = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const friends = useSelector(state => state.user.friends);

    const {palette} = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends.find(friend => friend._id === friendId);


    const patchFriend = async () =>  {
        const response = await fetch(`${API_URL}/users/${_id}/${friendId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
        
            const data = await response.json();
            dispatch(setFriends({friends: data}));
            getFriends();
            getFriendSuggestions();
    };


  return (
    <FlexBetween>
        <FlexBetween
            gap="1rem"
        >
            <UserImage image={userPicturePath} size="55px" />
            <Link
                to={`/profile/${friendId}`}
                style={{textDecoration: "none"}}
            >
                <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                    }}
                >
                    {name}
                </Typography>
                <Typography 
                    color={medium}
                    fontSize="0.75rem"
                >
                    {subtitle}
                </Typography>
            </Link>
        </FlexBetween>
        {
            _id !== friendId && !isProfileRoute && (
                <IconButton
                    onClick={patchFriend}
                    sx={{backgroundColor: primaryLight, p: "0.6rem"}}
                >
                    {
                            isFriend ? (
                                <PersonRemoveOutlined sx={{color: primaryDark}} />
                            ) : (
                                <PersonAddOutlined sx={{color: primaryDark}} />
                            )
                    }
                </IconButton>
            )

        }
      
    </FlexBetween>
  )
}

export default Friend;
