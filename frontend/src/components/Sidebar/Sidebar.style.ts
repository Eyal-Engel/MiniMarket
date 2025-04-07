import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  sidebar: {
    width: 240,
    height: "100%",
    right: 0,
    top: 0,
    backgroundColor: "#1976d2",
    color: "white",
    display: "flex",
    flexDirection: "column",
  },
  listItem: {
    color: "white",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "1.2rem",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#115293",
      fontWeight: "bolder",
      color: "white !important",
    },
    "&:visited": {
      color: "white",
    },
  },
  listItemText: {
    textAlign: "center",
  },
});

export default useStyles;
