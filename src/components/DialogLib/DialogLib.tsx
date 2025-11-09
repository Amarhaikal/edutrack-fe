import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import ButtonLib, { type ButtonType } from "../ButtonLib/ButtonLib";
import "./DialogLib.css";

export type DialogType = 'saveConfirmation' | 'deleteConfirmation' | 'custom';

export interface DialogLibProps {
  type: DialogType;
  open: boolean;
  onClose: () => void;
  onButtonClick: (buttonType: ButtonType) => void;
  title?: string;
  content?: string;
  width?: string;
  height?: string;
}

export default function DialogLib({
  type,
  open,
  onClose,
  onButtonClick,
  title,
  content,
  width = '350px',
  height = '150px'
}: DialogLibProps) {
  const getTitle = () => {
    if (type === 'saveConfirmation') return 'Save Confirmation';
    if (type === 'deleteConfirmation') return 'Delete Confirmation';
    return title || 'Dialog';
  };

  const getContent = () => {
    if (type === 'saveConfirmation') return 'Are you sure you want to save?';
    if (type === 'deleteConfirmation') return 'Are you sure you want to delete this item? This action cannot be undone.';
    return content || '';
  };

  const handleButtonClick = (buttonType: ButtonType) => {
    if (buttonType === 'cancel') {
      onClose();
      return;
    }
    onButtonClick(buttonType);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="dialog-lib"
      maxWidth="sm"
      PaperProps={{
        style: { width, height }
      }}
    >
      <DialogTitle className="dialog-title">
        {getTitle()}
      </DialogTitle>

      <DialogContent>
        <DialogContentText className="dialog-content">
          {getContent()}
        </DialogContentText>
      </DialogContent>

      <DialogActions className="dialog-actions">
        {type === 'saveConfirmation' && (
          <>
            <ButtonLib type="cancel" onClick={handleButtonClick} />
            <ButtonLib type="confirm" onClick={handleButtonClick} />
          </>
        )}
        {type === 'deleteConfirmation' && (
          <>
            <ButtonLib type="cancel" onClick={handleButtonClick} />
            <ButtonLib type="confirm" onClick={handleButtonClick} />
          </>
        )}
        {type === 'custom' && (
          <ButtonLib type="cancel" onClick={handleButtonClick} />
        )}
      </DialogActions>
    </Dialog>
  );
}