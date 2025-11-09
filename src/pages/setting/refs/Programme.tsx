import { useState, useEffect } from "react";
import TableLib, { type ActionEvent } from "../../../components/TableLib/TableLib";
import { useNavigate } from "react-router-dom";
import ButtonLib, { type ButtonType } from "../../../components/ButtonLib/ButtonLib";
import ActionButtonGroup from "../../../components/ActionButtonGroup/ActionButtonGroup";
import { getProgrammes } from "./ProgrammeService";

export interface ProgrammeData {
  id: number;
  code: string;
  description: string;
}

export default function Programme() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [programmeData, setProgrammeData] = useState<ProgrammeData[]>([]);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
        const response = await getProgrammes();
        setProgrammeData(response.data || []);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  const columns = [
    { id: "code", label: "Code" },
    { id: "description", label: "Description", textAlign: "left" as const },
  ];

  const handleActionEvent = (event: ActionEvent) => {
    if (event.action === "DETAILS") {
      const programmeData = event.data as ProgrammeData;
      navigate(`/edutrack/settings/refs/programme/${programmeData.id}`);
    }
  };

  const handleButtonClick = (type: ButtonType) => {
    if (type === "add") {
      navigate('/edutrack/settings/refs/programme/add');
    }
  };

  return (
    <div>
      <ActionButtonGroup>
        <ButtonLib type="add" onClick={handleButtonClick} />
      </ActionButtonGroup>
      <TableLib
        data={programmeData}
        columns={columns}
        loading={loading}
        actionType="DETAILS"
        onActionEvent={handleActionEvent}
      />
    </div>
  );
}
