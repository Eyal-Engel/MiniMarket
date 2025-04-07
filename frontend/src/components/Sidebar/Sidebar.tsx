import { Link } from "react-router-dom";
import useStyles from "./Sidebar.style";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";

const Sidebar = () => {
  const classes = useStyles();

  return (
    <Box className={classes.sidebar}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          paddingTop: 2,
          paddingBottom: 1,
          borderBottom: "2px solid white",
          borderBottomWidth: 2,
        }}
      >
        MiniMarket
      </Typography>
      <List>
        <ListItem
          component={Link}
          to="/store-owner/orders"
          className={classes.listItem}
        >
          <ListItemText primary="בעל מכולת" className={classes.listItemText} />
        </ListItem>
        <ListItem component={Link} to="/supplier" className={classes.listItem}>
          <ListItemText primary="ספק" className={classes.listItemText} />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
