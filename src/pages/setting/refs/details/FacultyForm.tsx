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
import { findFaculty, createFaculty, updateFaculty } from "../FacultyService";

export default function FacultyForm() {
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
    const initFaculty = async (facultyId: number) => {
      try {
        setIsLoading(true);
        const response = await findFaculty(facultyId);
        const faculty = response.data;
        if (faculty) {
          setForm({
            code: faculty.code,
            description: faculty.description,
          });
          setValidationState({
            code: true,
            description: true,
          });
        }
      } catch (error) {
        console.error("Faculty error", error);
        showSnackBar({
          type: "error",
          action: "custom",
          message: "Failed to load faculty data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      setIsEdit(true);
      initFaculty(parseInt(id));
    }
  }, [id, showSnackBar]);

  const onSave = async () => {
    setIsDialogOpen(false);

    try {
      if (isEdit && id) {
        // Update existing faculty
        const response = await updateFaculty({ description: form.description }, parseInt(id));
        if (response.status === 200) {
          showSnackBar({
            type: "success",
            action: "save",
            entityName: "Faculty",
          });
          setTimeout(() => {
            navigate("/edutrack/settings/refs");
          }, 500);
        } else {
          showSnackBar({
            type: "error",
            action: "save",
            entityName: "Faculty",
          });
        }
      } else {
        // Create new faculty
        const response = await createFaculty({
          code: form.code,
          description: form.description,
        });
        if (response.status === 200 || response.status === 201) {
          showSnackBar({
            type: "success",
            action: "save",
            entityName: "Faculty",
          });
          setTimeout(() => {
            navigate("/edutrack/settings/refs");
          }, 500);
        } else {
          showSnackBar({
            type: "error",
            action: "save",
            entityName: "Faculty",
          });
        }
      }
    } catch (error) {
      console.error("Error saving faculty:", error);
      showSnackBar({
        type: "error",
        action: "save",
        entityName: "Faculty",
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
      <PageTitle isButtonBack>{isEdit ? "Faculty Details" : "Add Faculty"}</PageTitle>

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
