import { useState, useEffect } from "react";
import TableLib, { type ActionEvent } from "../../../components/TableLib/TableLib";
import { useNavigate } from "react-router-dom";
import ButtonLib, { type ButtonType } from "../../../components/ButtonLib/ButtonLib";
import ActionButtonGroup from "../../../components/ActionButtonGroup/ActionButtonGroup";
import { getFaculties } from "./FacultyService";

export interface FacultyData {
  id: number;
  code: string;
  description: string;
}

export default function Faculty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facultyData, setFacultyData] = useState<FacultyData[]>([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        const response = await getFaculties();
        setFacultyData(response.data || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  const columns = [
    { id: "code", label: "Code" },
    { id: "description", label: "Description", textAlign: "left" as const },
  ];

  const handleActionEvent = (event: ActionEvent) => {
    if (event.action === "DETAILS") {
      const facultyData = event.data as FacultyData;
      navigate(`/edutrack/settings/refs/faculty/${facultyData.id}`);
    }
  };

  const handleButtonClick = (type: ButtonType) => {
    if (type === "add") {
      navigate('/edutrack/settings/refs/faculty/add');
    }
  };

  return (
    <div>
      <ActionButtonGroup>
        <ButtonLib type="add" onClick={handleButtonClick} />
      </ActionButtonGroup>
      <TableLib
        data={facultyData}
        columns={columns}
        loading={loading}
        actionType="DETAILS"
        onActionEvent={handleActionEvent}
      />
    </div>
  );
}
