import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonLib, { type ButtonType } from "../../../../components/ButtonLib/ButtonLib";
import PageTitle from "../../../../components/PageTitle/PageTitle";
import TextboxLib from "../../../../components/TextboxLib/TextboxLib";
import ActionButtonGroup from "../../../../components/ActionButtonGroup/ActionButtonGroup";
import FormLayout from "../../../../components/FormLayout/FormLayout";
import DialogLib from "../../../../components/DialogLib/DialogLib";
import type { FormValueChangeEvent } from "../../../../components/TextboxLib/TextboxLib";
import {
  type ValidationState,
  updateValidationState,
  validateRequiredFields,
} from "../../../../utils/formValidation";
import { useSnackBar } from "../../../../contexts/SnackBarContext";
import { findProgramme, createProgramme, updateProgramme } from "../ProgrammeService";

export default function ProgrammeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const [form, setForm] = useState({
    code: "",
    description: "",
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formChange = (e: FormValueChangeEvent) => {
    setForm({ ...form, [e.controlName]: e.value });
    updateValidationState(e.controlName, e.valid, setValidationState);
  };

  useEffect(() => {
    const initProgramme = async (programmeId: number) => {
      try {
        setIsLoading(true);
        const response = await findProgramme(programmeId);
        const programme = response.data;
        if (programme) {
          setForm({
            code: programme.code,
            description: programme.description,
          });
          setValidationState({
            code: true,
            description: true,
          });
        }
      } catch (error) {
        console.error("Programme error", error);
        showSnackBar({
          type: "error",
          action: "custom",
          message: "Failed to load programme data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      setIsEdit(true);
      initProgramme(parseInt(id));
    }
  }, [id, showSnackBar]);

  const onSave = async () => {
    setIsDialogOpen(false);

    try {
      if (isEdit && id) {
        // Update existing programme
        const response = await updateProgramme({ description: form.description }, parseInt(id));
        if (response.status === 200) {
          showSnackBar({
            type: "success",
            action: "save",
            entityName: "Programme",
          });
          setTimeout(() => {
            navigate("/edutrack/settings/refs");
          }, 500);
        } else {
          showSnackBar({
            type: "error",
            action: "save",
            entityName: "Programme",
          });
        }
      } else {
        // Create new programme
        const response = await createProgramme({
          code: form.code,
          description: form.description,
        });
        if (response.status === 200 || response.status === 201) {
          showSnackBar({
            type: "success",
            action: "save",
            entityName: "Programme",
          });
          setTimeout(() => {
            navigate("/edutrack/settings/refs");
          }, 500);
        } else {
          showSnackBar({
            type: "error",
            action: "save",
            entityName: "Programme",
          });
        }
      }
    } catch (error) {
      console.error("Error saving programme:", error);
      showSnackBar({
        type: "error",
        action: "save",
        entityName: "Programme",
      });
    }
  };

  const onClickButton = (e: ButtonType) => {
    if (e === "save") {
      setShowErrors(true);
      const requiredFields = ["code", "description"];
      const isValid = validateRequiredFields(requiredFields, validationState, form);

      if (!isValid) {
        showSnackBar({
          type: "error",
          action: "custom",
          message: "Please fill in all required fields correctly",
        });
        return;
      }

      setIsDialogOpen(true);
    }
  };

  const handleDialogAction = (buttonType: ButtonType) => {
    if (buttonType === "confirm") {
      onSave();
    }
  };

  return (
    <>
      <PageTitle isButtonBack>{isEdit ? "Programme Details" : "Add Programme"}</PageTitle>

      <FormLayout isLoading={isLoading} heightLoading={160}>
        <TextboxLib
          label="Code"
          controlName="code"
          value={form.code}
          isRequired={true}
          maxLength={10}
          onValueChange={formChange}
          showValidation={showErrors}
          disabled={isEdit}
        />
        <TextboxLib
          label="Description"
          controlName="description"
          value={form.description}
          isRequired={true}
          maxLength={150}
          onValueChange={formChange}
          showValidation={showErrors}
        />
      </FormLayout>

      <ActionButtonGroup>
        <ButtonLib type="save" onClick={onClickButton} />
      </ActionButtonGroup>

      <DialogLib
        type="saveConfirmation"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onButtonClick={handleDialogAction}
      />
    </>
  );
}
