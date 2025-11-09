import ButtonLib, {
  type ButtonType,
} from "../../components/ButtonLib/ButtonLib";
import PageTitle from "../../components/PageTitle/PageTitle";
import TextboxLib from "../../components/TextboxLib";
import { useEffect, useState } from "react";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import SelectLib from "../../components/SelectLib";
import type { FormValueChangeEvent } from "../../components/TextboxLib/TextboxLib";
import { useReferenceData } from "../../contexts/ReferenceDataContext";
import FormLayout from "../../components/FormLayout/FormLayout";
import DialogLib from "../../components/DialogLib/DialogLib";
import { findUser, registerUser, updateUser } from "./UserService";
import { useNavigate, useParams } from "react-router-dom";
import {
  type ValidationState,
  updateValidationState,
  validateRequiredFields,
} from "../../utils/formValidation";
import { useSnackBar } from "../../contexts/SnackBarContext";

export default function UserForm() {
  // init ref
  const { roles } = useReferenceData();
  const { programme } = useReferenceData();
  const { faculty } = useReferenceData();

  const { id } = useParams();

  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    idno: "",
    role: "",
    programme: "",
    faculty: "",
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [showErrors, setShowErrors] = useState(false); // New state to trigger showing errors
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formChange = (e: FormValueChangeEvent) => {
    setForm({ ...form, [e.controlName]: e.value });
    // Track validation state for each field
    updateValidationState(e.controlName, e.valid, setValidationState);
  };

  const roleOptions = roles.map((role) => ({
    value: role.code,
    label: role.description,
  }));

  const programmeOptions = programme.map((prog) => ({
    value: prog.code,
    label: `${prog.code} - ${prog.description}`,
  }));

  const facultyOptions = faculty.map((fac) => ({
    value: fac.code,
    label: `${fac.code} - ${fac.description}`,
  }));

  useEffect(() => {
    const initUser = async (id: number) => {
      try {
        setIsLoading(true);
        const responseUser = await findUser(id);
        patchForm(responseUser.data);
      } catch (error) {
        console.error("user error", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      setIsEdit(true);
      initUser(parseInt(id));
    }
  }, [id]);

  const patchForm = (data: any) => {
    setForm({
      ...form,
      name: data?.name,
      email: data?.email,
      idno: data?.idno,
      role: data?.role?.code,
      programme: data?.student?.programme?.code,
      faculty: data?.lecturer?.faculty?.code,
      // name: data?.name,
    });

    // Initialize validation state for pre-populated fields in edit mode
    const initialValidationState: ValidationState = {};
    if (data?.name) initialValidationState.name = true;
    if (data?.email) initialValidationState.email = true;
    if (data?.idno) initialValidationState.idno = true;
    if (data?.role?.code) initialValidationState.role = true;
    if (data?.student?.programme?.code) initialValidationState.programme = true;
    if (data?.lecturer?.faculty?.code) initialValidationState.faculty = true;

    setValidationState(initialValidationState);
  };

  const onSave = () => {
    setIsDialogOpen(false);
    if (!id) {
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        idno: form.idno,
        role_code: form.role,
        programme_code: form.programme,
        faculty_code: form.faculty,
      })
        .then((data) => {
          // authenticatedFetch returns parsed JSON data, not Response object
          if (data.status === 200) {
            // Show success notification
            showSnackBar({
              type: "success",
              action: "save",
              entityName: "User",
            });

            // Reset the form after successful registration
            setForm({
              name: "",
              email: "",
              password: "",
              idno: "",
              role: "",
              programme: "",
              faculty: "",
            });

            // Navigate to users list after showing notification
            setTimeout(() => {
              navigate("/edutrack/users");
            }, 500);
          } else {
            // Show error notification
            showSnackBar({
              type: "error",
              action: "save",
              entityName: "User",
            });
          }
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          // Show error notification
          showSnackBar({
            type: "error",
            action: "save",
            entityName: "User",
          });
        });
    } else {
      updateUser({
        name: form.name,
        email: form.email,
        idno: form.idno,
        programme_code: form.programme,
        faculty_code: form.faculty,
      }, parseInt(id))
        .then(res => {
          // authenticatedFetch returns parsed JSON data, not Response object
          if (res.status === 200) {
            // Show success notification
            showSnackBar({
              type: "success",
              action: "save",
              entityName: "User",
            });

            const user = res?.data;
            console.log('updated user', user);
            console.log('updated user', user);
            console.log('updated faculty code', user?.lecturer?.faculty?.code);

            // Reset the form after successful registration
            setForm({
              ...form,
              name: user?.name,
              email: user?.email,
              idno: user?.idno,
              role: user?.role?.code,
              programme: user?.role?.code === 'STUD' ? user?.student?.programme?.code : null,
              faculty: user?.role?.code === 'LECT' ? user?.lecturer?.faculty?.code : null,
            });
          } else {
            // Show error notification
            showSnackBar({
              type: "error",
              action: "save",
              entityName: "User",
            });
          }
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          // Show error notification
          showSnackBar({
            type: "error",
            action: "save",
            entityName: "User",
          });
        });
    }
  };

  const onClickButton = (e: ButtonType) => {
    if (e === "save") {
      // Trigger showing errors on all fields
      setShowErrors(true);

      // Define required fields based on selected role
      let requiredFields: string[] = [];
      if (!id) {
        requiredFields = ["name", "email", "password", "idno", "role"];
        if (form.role === 'STUD') {
          requiredFields.push("programme");
        } else if (form.role === 'LECT') {
          requiredFields.push("faculty");
        }
      } else {
        requiredFields = ["name", "email", "idno", "role"];
        if (form.role == 'STUD') {
          requiredFields.push("programme");
        } else if (form.role === 'LECT') {
          requiredFields.push("faculty");
        }
      }

      // Validate all required fields
      const isValid = validateRequiredFields(requiredFields, validationState, form);

      if (!isValid) {
        showSnackBar({
          type: "error",
          action: "custom",
          message: "Please fill in all required fields correctly",
        });
        return;
      }

      // If validation passes, open confirmation dialog
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
      <PageTitle isButtonBack>{isEdit ? "User Details" : "Add User"}</PageTitle>

      <FormLayout isLoading={isLoading} heightLoading={160}>
        <TextboxLib
          label="Name"
          controlName="name"
          value={form.name}
          isRequired={true}
          maxLength={150}
          onValueChange={(e) => formChange(e)}
          showValidation={showErrors}
        />
        <TextboxLib
          label="Email"
          controlName="email"
          value={form.email}
          type="email"
          onValueChange={(e) => formChange(e)}
          isRequired={true}
          showValidation={showErrors}
        />
        {id == null && (
          <>
            <TextboxLib
              label="Password"
              controlName="password"
              value={form.password}
              type="password"
              onValueChange={(e) => formChange(e)}
              isRequired={true}
              minLength={8}
              showValidation={showErrors}
            />
          </>
        )}
        <TextboxLib
          label="ID No"
          controlName="idno"
          value={form.idno}
          type="idno"
          onValueChange={(e) => formChange(e)}
          isRequired={true}
          showValidation={showErrors}
        />
        <SelectLib
          options={roleOptions}
          label="Role"
          controlName="role"
          value={form.role}
          disabled={id ? true : false}
          onValueChange={(e) => formChange(e)}
          isRequired={true}
          showValidation={showErrors}
        />
        {String(form.role) === "STUD" && (
          <>
            <SelectLib
              options={programmeOptions}
              label="Programme"
              controlName="programme"
              value={form.programme}
              onValueChange={(e) => formChange(e)}
              isRequired={true}
              showValidation={showErrors}
            />
          </>
        )}
        {String(form.role) === "LECT" && (
          <>
            <SelectLib
              options={facultyOptions}
              label="Faculty"
              controlName="faculty"
              value={form.faculty}
              onValueChange={(e) => formChange(e)}
              isRequired={true}
              showValidation={showErrors}
            />
          </>
        )}
      </FormLayout>

      <ActionButtonGroup>
        <ButtonLib type="save" onClick={(e) => onClickButton(e)} />
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
