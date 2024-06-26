import {Box} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserImage = ({image, size = "60px"}) => {
    return (
        <Box width={size} height={size}>
            {
                !image ? (<AccountCircleIcon sx={{width:size, height:size}} />) : (
                    <img
                        style={{objectFit: "cover", borderRadius: "50%"}}
                        width={size}
                        height={size}
                        alt="user"
                        src={image}
                    />
                )
            }
            
        </Box>
    )
}


export default UserImage;