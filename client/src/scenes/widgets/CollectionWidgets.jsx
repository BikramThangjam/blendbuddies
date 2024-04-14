import {
  Box,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
    ImageOutlined,
    OndemandVideoOutlined
    
  } from "@mui/icons-material";
  
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const CollectionWidgets = () => {

    const {palette} = useTheme();
    const medium = palette.neutral.medium;
    const main = palette.primary.main

  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <FlexBetween gap="0.25rem">
          <ImageOutlined sx={{ color: "pointer" }} />
          <Typography
            color={medium}
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: main,
              },
            }}
          >
            Photos
          </Typography>
        </FlexBetween>
    
        <FlexBetween gap="0.25rem">
          <OndemandVideoOutlined sx={{ color: medium }} />
          <Typography 
            color={medium}
            sx={{
                "&:hover": {
                  cursor: "pointer",
                  color: main,
                },
              }}
            >
                Videos
            </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default CollectionWidgets;
