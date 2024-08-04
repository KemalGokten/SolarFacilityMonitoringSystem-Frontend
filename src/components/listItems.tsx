import { Link, useLocation } from "react-router-dom";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LegendToggleIcon from '@mui/icons-material/LegendToggle';

export const MainListItems = () => {
  const location = useLocation();

  return (
    <>
      <ListItemButton
        component={Link}
        to="/facilities"
        selected={location.pathname === "/facilities"}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Facilities" />
      </ListItemButton>
      <ListItemButton
        component={Link}
        to="/monitoring"
        selected={location.pathname === "/monitoring"}
      >
        <ListItemIcon>
          <LegendToggleIcon />
        </ListItemIcon>
        <ListItemText primary="Monitoring" />
      </ListItemButton>
    </>
  );
};
