import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PageTitle from "../../../components/PageTitle/PageTitle";
import Role from "./Role";
import Faculty from "./Faculty";
import Programme from "./Programme";
import "./Refs.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`refs-tabpanel-${index}`}
      aria-labelledby={`refs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Refs() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ color: "white" }}>
      <PageTitle>Reference Data Management</PageTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="reference data tabs"
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.7)",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              minWidth: 120,
            },
            "& .Mui-selected": {
              color: "#795bfcff !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#795bfcff",
            },
          }}
        >
          <Tab label="Role" />
          <Tab label="Faculty" />
          <Tab label="Programme" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Role />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Faculty />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Programme />
      </TabPanel>
    </div>
  );
}
