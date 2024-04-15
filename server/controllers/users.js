import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id)
        
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        );
        
        const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath}
        })
    
        res.status(200).json(formattedFriends)  
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            // remove from friend list
            user.friends = user.friends.filter(id => id !== friendId);
            friend.friends = friend.friends.filter(id => id !== id)
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        
        await user.save();
        await friend.save();

        // Getting the 
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        );
        
        const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath}
        })

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const updateSocial = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming you're passing the user's ID in the request parameters
        const { socialPlatform, profileUrl } = req.body; // Assuming you're sending the social platform and updated URL in the request body
        console.log("userid ",userId);
        // Validate if userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Validate if socialPlatform and profileUrl are provided
        if (!socialPlatform || !profileUrl) {
            return res.status(400).json({ error: 'Social platform and profile URL are required' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the social profile URL based on the social platform
        if (user.socialProfileUrl.hasOwnProperty(socialPlatform)) {
            user.socialProfileUrl[socialPlatform] = profileUrl;
        } else {
            return res.status(400).json({ error: 'Invalid social platform' });
        }

        // Save the updated user data
        await user.save();

        // Return success response
        return res.status(200).json({socialProfileUrl: user.socialProfileUrl} );
    } catch (err) {
        console.error('Error updating social profile URL:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}