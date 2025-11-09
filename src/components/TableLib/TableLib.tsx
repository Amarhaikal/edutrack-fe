import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import "./TableLib.css";
import { ListCollapse, Trash2 } from "lucide-react";

export type ActionType = "NONE" | "DELETE" | "DETAILS" | "DETAILS_DELETE";

export interface ActionEvent {
  action: "DELETE" | "DETAILS";
  data: any;
}

export interface TableLibProps {
  data: any[];
  columns: any[];
  loading: boolean;
  totalCount?: number;
  onPageChange?: (page: number, limit: number) => void;
  actionType?: ActionType;
  onActionEvent?: (event: ActionEvent) => void;
}

export default function TableLib({
  data,
  columns,
  loading,
  totalCount,
  onPageChange,
  actionType = "NONE",
  onActionEvent,
}: TableLibProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDeleteClick = (rowData: any) => {
    if (onActionEvent) {
      onActionEvent({
        action: "DELETE",
        data: rowData,
      });
    }
  };

  const handleDetailsClick = (rowData: any) => {
    if (onActionEvent) {
      onActionEvent({
        action: "DETAILS",
        data: rowData,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    // Call parent with new page and limit (page 0, new limit)
    onPageChange?.(0, newLimit);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    // Call parent with new page and current limit
    onPageChange?.(newPage, rowsPerPage);
  };

  // Use data directly since pagination is handled by API
  const paginatedData = data;
  return (
    <>
      <TableContainer className="table-container">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ textAlign: "center" }}
                className="table-header-cell"
              >
                No.
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  sx={{ textAlign: "center" }}
                  className="table-header-cell"
                  key={column.id}
                >
                  {column.label}
                </TableCell>
              ))}
              {actionType !== "NONE" && (
                <TableCell
                  sx={{ textAlign: "center" }}
                  className="table-header-cell"
                >
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + 1 + (actionType !== "NONE" ? 1 : 0)
                  }
                  sx={{
                    textAlign: "center",
                    padding: "40px",
                    backgroundColor: "rgb(42, 40, 56)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CircularProgress sx={{ color: "white" }} />
                    <Box sx={{ color: "white", fontSize: "14px" }}>
                      Loading...
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length + 1 + (actionType !== "NONE" ? 1 : 0)
                    }
                    sx={{
                      textAlign: "left",
                      color: "white",
                      backgroundColor: "rgb(42, 40, 56)",
                    }}
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => {
                  const isEven = index % 2 === 0;
                  const backgroundColor = isEven
                    ? "rgb(42, 40, 56)"
                    : "rgb(37, 36, 48)";

                  return (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          color: "white",
                          fontSize: "11px",
                          backgroundColor: backgroundColor,
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell
                          sx={{
                            textAlign: column.textAlign || "center",
                            color: "white",
                            fontSize: "11px",
                            backgroundColor: backgroundColor,
                          }}
                          key={column.id}
                        >
                          {row[column.id]}
                        </TableCell>
                      ))}
                      {actionType === "DELETE" && (
                        <TableCell
                          sx={{
                            textAlign: "center",
                            color: "white",
                            fontSize: "11px",
                            backgroundColor: backgroundColor,
                          }}
                        >
                          <IconButton
                            onClick={() => handleDeleteClick(row)}
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                color: "#dc2626",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                            size="small"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </TableCell>
                      )}
                      {actionType === "DETAILS" && (
                        <TableCell
                          sx={{
                            textAlign: "center",
                            color: "white",
                            fontSize: "11px",
                            backgroundColor: backgroundColor,
                          }}
                        >
                          <IconButton
                            onClick={() => handleDetailsClick(row)}
                            sx={{
                              color: "#795bfcff",
                              "&:hover": {
                                color: "#795bfcff",
                                backgroundColor: "#5a3ed82c",
                              },
                            }}
                            size="small"
                          >
                            <ListCollapse size={16} />
                          </IconButton>
                        </TableCell>
                      )}
                      {actionType === "DETAILS_DELETE" && (
                        <TableCell
                          sx={{
                            textAlign: "center",
                            color: "white",
                            fontSize: "11px",
                            backgroundColor: backgroundColor,
                          }}
                        >
                          <IconButton
                            onClick={() => handleDetailsClick(row)}
                            sx={{
                              color: "#795bfcff",
                              "&:hover": {
                                color: "#795bfcff",
                                backgroundColor: "#5a3ed82c",
                              },
                            }}
                            size="small"
                          >
                            <ListCollapse size={16} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(row)}
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                color: "#dc2626",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                            size="small"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount || data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="table-pagination"
      />
    </>
  );
}
