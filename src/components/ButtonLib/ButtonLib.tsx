import { Button } from "@mui/material";
import { Plus, RotateCcw } from "lucide-react";
import "./ButtonLib.css";

export type ButtonType = 'add' | 'reset' | 'save' | 'back' | 'confirm' | 'cancel';

export interface ButtonLibProps {
  type: ButtonType;
  onClick: (type: ButtonType) => void;
}

export default function ButtonLib({ onClick, type }: ButtonLibProps) {
  return (
    <div style={{marginTop: 4, marginBottom: 4}}>
      {type === 'add' && <Button size="small" variant="contained" className="primary" onClick={() => onClick(type)} startIcon={<Plus size={14} />}>Add</Button>}
      {type === 'reset' && <Button size="small" variant="contained" className="danger" onClick={() => onClick(type)} startIcon={<RotateCcw size={14} />}>Reset</Button>}
      {type === 'save' && <Button size="small" variant="contained" className="success" onClick={() => onClick(type)}>Save</Button>}
      {type === 'back' && <Button size="small" variant="contained" className="secondary" onClick={() => onClick(type)}>Back</Button>}
      {type === 'confirm' && <Button size="small" variant="contained" className="success" onClick={() => onClick(type)}>Confirm</Button>}
      {type === 'cancel' && <Button size="small" variant="contained" className="danger" onClick={() => onClick(type)}>Cancel</Button>}
    </div>
  );
}
