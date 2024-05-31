// UserStyles.js

export const buttonStyle = {
  fontSize: "1rem",
  border: "1px solid none",
  color: "#fff",
  fontWeight: 500,
  letterSpacing: ".1rem",
  textTransform: "capitalize",
};

export const buttonStyleHover = {
  ...buttonStyle,
  border: "1px solid #fff",
  backgroundColor: "#336492",
  transition: "border-color 0.3s ease-in-out",
};

export const NavBar = {
  position: "fixed",
  top: "5.2rem",
  left: 0,
  maxWidth: "17rem",
  height: "100vh",
  backgroundColor: "#eee",
  padding: "0.45rem",
  overflowY: "auto",
};

export const sidebarItem = {
  backgroundColor: "#0D3343",
  height: "80vh",
  borderRadius: "0rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0.5rem",
};

export const navLink = {
  marginBottom: "1rem",
  width: "100%",
  textAlign: "left",
  color: "#fff",
  textDecoration: "none",
};

export const NavItem = {
  backgroundColor: "#0D3343",
  height: "80vh",
  borderRadius: "0rem",
};

export const gridItem = {
  backgroundColor: "#fff",
  height: "auto",
  borderRadius: "0rem",
};
