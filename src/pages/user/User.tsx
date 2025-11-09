import { useEffect, useState, useCallback } from "react";
import { getUser, deleteUser } from "./UserService";
import TextboxLib from "../../components/TextboxLib/TextboxLib";
import TableLib, { type ActionEvent } from "../../components/TableLib/TableLib";
import SelectLib from "../../components/SelectLib/SelectLib";
import { useReferenceData } from "../../contexts/ReferenceDataContext";
import { useAuth } from "../../contexts/AuthContext";
import ButtonLib, {
  type ButtonType,
} from "../../components/ButtonLib/ButtonLib";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import SearchForm from "../../components/SearchForm/SearchForm";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import DialogLib from "../../components/DialogLib/DialogLib";
import { useSnackBar } from "../../contexts/SnackBarContext";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
export interface User {
  id: number;
  name: string;
  email: string;
  idno: string;
  role: any;
  created_by: string;
  updated_by: string | null;
}

export default function User() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { roles } = useReferenceData();
  const authContext = useAuth();
  const { showSnackBar } = useSnackBar();

  // Console log auth context values only when they change
  useEffect(() => {
    console.log('Auth Context Updated:', {
      user: authContext.user,
      token: authContext.token ? '***TOKEN***' : null, // Hide token for security
      isAuthenticated: authContext.isAuthenticated,
      isLoading: authContext.isLoading
    });
  }, [authContext.user, authContext.token, authContext.isAuthenticated, authContext.isLoading]);
  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.description,
  }));
  const [page, setPage] = useState(0); // MUI uses 0-based indexing
  const [limit, setLimit] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchForm, setSearchForm] = useState({
    name: "",
    role: "",
  });

  const columns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(
      (searchParams: {
        page: number;
        limit: number;
        name: string;
        role: string | number;
      }) => {
        setLoading(true);
        getUser(searchParams)
          .then((response) => {
            setUsers(
              response.data.map((user: any) => ({
                ...user,
                role: user.role.description,
              }))
            );
            setTotalCount(response.total);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
          });
      },
      500
    ),
    []
  );

  useEffect(() => {
    debouncedSearch({
      page: page + 1, // Convert 0-based to 1-based for API
      limit: limit,
      name: searchForm.name || "",
      role: searchForm.role || 0,
    });
  }, [searchForm, debouncedSearch, page, limit]);

  const handleSearch = ({
    controlName,
    value,
  }: {
    controlName: string;
    value: string | number;
    valid: boolean;
  }) => {
    setSearchForm({
      ...searchForm,
      [controlName]: value,
    });
  };

  const handlePageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  const onAdd = () => {
    navigate('/edutrack/users/add');
  };

  const onReset = () => {
    setSearchForm({
      name: "",
      role: "",
    });
    setPage(0);
  };

  const handleButtonClick = (type: ButtonType) => {
    console.log(`Button clicked: ${type}`);
    if (type === "add") {
      onAdd();
    } else if (type === "reset") {
      onReset();
    }
  };

  const handleActionEvent = (event: ActionEvent) => {
    // console.log('Action Event:', event.action);
    // console.log('Selected Data:', event.data);

    if (event.action === 'DELETE') {
      const userData = event.data as User;
      setSelectedUser(userData);
      setIsDeleteDialogOpen(true);
    }

    if (event.action === "DETAILS") {
      const userData = event.data as User;
      navigate(`/edutrack/users/details/${userData.id}`);
    }
  };

  const handleDeleteDialogAction = async (buttonType: ButtonType) => {
    if (buttonType === 'confirm' && selectedUser) {
      console.log(`Confirmed deletion of user: ${selectedUser.name} (ID: ${selectedUser.id})`);

      try {
        await deleteUser(selectedUser.id);
        console.log('User deleted successfully');

        // Show success notification
        showSnackBar({
          type: "success",
          action: "delete",
          entityName: selectedUser.name,
        });

        // Refresh the user list
        debouncedSearch({
          page: page + 1,
          limit: limit,
          name: searchForm.name || "",
          role: searchForm.role || 0,
        });
      } catch (error) {
        console.error('Error deleting user:', error);

        // Show error notification
        showSnackBar({
          type: "error",
          action: "delete",
          entityName: selectedUser.name,
        });
      }

      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div style={{ color: "white" }}>
      <PageTitle>User Management</PageTitle>
      <SearchForm>
        <TextboxLib
          label="Search Name"
          controlName="name"
          value={searchForm.name}
          onValueChange={handleSearch}
        />
        <SelectLib
          label="Search Role"
          controlName="role"
          value={searchForm.role}
          options={roleOptions}
          onValueChange={handleSearch}
          isRefData={true}
        />
      </SearchForm>
      <ActionButtonGroup>
        <ButtonLib type="reset" onClick={handleButtonClick} />
        <ButtonLib type="add" onClick={handleButtonClick} />
      </ActionButtonGroup>
      <TableLib
        data={users}
        columns={columns}
        loading={loading}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        actionType="DETAILS_DELETE"
        onActionEvent={handleActionEvent}
      />
      <DialogLib
        type="deleteConfirmation"
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onButtonClick={handleDeleteDialogAction}
        content={selectedUser ? `Are you sure you want to delete user "${selectedUser.name}"? This action cannot be undone.` : undefined}
        height="160px"
      />
    </div>
  );
}
