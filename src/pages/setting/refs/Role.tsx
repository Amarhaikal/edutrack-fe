import { useState, useEffect } from "react";
import TableLib, { type ActionEvent } from "../../../components/TableLib/TableLib";
import { useNavigate } from "react-router-dom";
import ButtonLib, { type ButtonType } from "../../../components/ButtonLib/ButtonLib";
import ActionButtonGroup from "../../../components/ActionButtonGroup/ActionButtonGroup";
import { getRoles } from "./RoleService";

export interface RoleData {
  id: number;
  code: string;
  description: string;
}

export default function Role() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState<RoleData[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getRoles();
        setRoleData(response.data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const columns = [
    { id: "code", label: "Code" },
    { id: "description", label: "Description", textAlign: "left" as const },
  ];

  const handleActionEvent = (event: ActionEvent) => {
    if (event.action === "DETAILS") {
      const roleData = event.data as RoleData;
      navigate(`/edutrack/settings/refs/role/${roleData.id}`);
    }
  };

  const handleButtonClick = (type: ButtonType) => {
    if (type === "add") {
      navigate('/edutrack/settings/refs/role/add');
    }
  };

  return (
    <div>
      <ActionButtonGroup>
        <ButtonLib type="add" onClick={handleButtonClick} />
      </ActionButtonGroup>
      <TableLib
        data={roleData}
        columns={columns}
        loading={loading}
        actionType="DETAILS"
        onActionEvent={handleActionEvent}
      />
    </div>
  );
}
