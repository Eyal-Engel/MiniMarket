import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  sidebar: {
    width: 240, // רוחב ה-Sidebar
    height: "100%", // גובה מלא
    right: 0, // יישור לימין
    top: 0,
    backgroundColor: "#1976d2", // צבע רקע (primary.main)
    color: "white", // צבע טקסט
    display: "flex",
    flexDirection: "column",
  },
  listItem: {
    color: "white",
    textAlign: "left",
    fontWeight: "bold", // טקסט מודגש
    fontSize: "1.2rem", // גודל פונט מוגדל
    textDecoration: "none", // ביטול קו תחתון
    "&:hover": {
      backgroundColor: "#115293", // רקע כהה יותר ב-HOVER (primary.dark)
      fontWeight: "bolder", // טקסט מודגש יותר ב-HOVER
    },
  },
  listItemText: {
    textAlign: "center",
  },
});

export default useStyles;
