import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  GetFacilitiesQuery,
  GetFacilitiesDocument,
} from "../graphql/generated";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useGetFacilitiesQuery({
    variables: { userId: user?.id || "" },
    skip: !user?.id,
  });

  const [createFacility] = useCreateFacilityMutation({
    update(cache, { data }) {
      if (!data) return;

      const newFacility = data.createFacility;

      // Update the cache to include the new facility
      const { facilities } = cache.readQuery<GetFacilitiesQuery>({
        query: GetFacilitiesDocument,
        variables: { userId: user?.id || "" },
      }) || { facilities: { facilities: [] } };

      cache.writeQuery({
        query: GetFacilitiesDocument,
        variables: { userId: user?.id || "" },
        data: {
          facilities: {
            ...facilities,
            facilities: [...facilities.facilities, newFacility],
          },
        },
      });
    },
  });

  const [updateFacility] = useUpdateFacilityMutation({
    update(cache, { data }) {
      if (!data) return;

      const updatedFacility = data.updateFacility;

      // Update the cache to reflect the updated facility
      const { facilities } = cache.readQuery<GetFacilitiesQuery>({
        query: GetFacilitiesDocument,
        variables: { userId: user?.id || "" },
      }) || { facilities: { facilities: [] } };

      cache.writeQuery({
        query: GetFacilitiesDocument,
        variables: { userId: user?.id || "" },
        data: {
          facilities: {
            ...facilities,
            facilities: facilities.facilities.map((facility) =>
              facility.id === updatedFacility.id ? updatedFacility : facility
            ),
          },
        },
      });
    },
  });

  const [deleteFacility] = useDeleteFacilityMutation({
    update(cache, { data }) {
      if (!data || !data.deleteFacility) return;

      // Remove the deleted facility from the cache
      const deletedFacilityId = data.deleteFacility.id;

      // Remove the facility from the list in cache
      const { facilities } = cache.readQuery<GetFacilitiesQuery>({
        query: GetFacilitiesDocument,
        variables: { userId: user?.id || "" },
      }) || { facilities: { facilities: [] } };

      cache.writeQuery({
        query: GetFacilitiesDocument,
        variables: { userId: user?.id || "" },
        data: {
          facilities: {
            ...facilities,
            facilities: facilities.facilities.filter(
              (facility) => facility.id !== deletedFacilityId
            ),
          },
        },
      });

      if (localStorage.getItem("lastVisitedFacilityId") === deletedFacilityId) {
        localStorage.removeItem("lastVisitedFacilityId");
      }
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    null
  );
  const [name, setName] = useState("");
  const [nominalPower, setNominalPower] = useState("");

  const handleOpenDialog = (facilityId?: string) => {
    if (facilityId) {
      const facility = data?.facilities?.facilities?.find(
        (facility) => facility.id === facilityId
      );
      if (facility) {
        setEditingFacilityId(facilityId);
        setName(facility.name);
        setNominalPower(facility.nominalPower.toString());
      }
    } else {
      setEditingFacilityId(null);
      setName("");
      setNominalPower("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (user?.id) {
        if (editingFacilityId) {
          await updateFacility({
            variables: {
              id: editingFacilityId,
              name,
              nominalPower: Number(nominalPower),
            },
          });
        } else {
          await createFacility({
            variables: {
              name,
              nominalPower: Number(nominalPower),
              userId: user.id,
            },
          });
        }
        handleCloseDialog();
      } else {
        console.error("User is not authenticated");
      }
    } catch (error) {
      console.error("Error saving facility:", error);
    }
  };

  const handleDelete = async (facilityId: string) => {
    try {
      if (user?.id) {
        await deleteFacility({
          variables: { id: facilityId },
        });
      } else {
        console.error("User is not authenticated");
      }
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
  };

  const handleRowClick = (facilityId: string) => {
    localStorage.setItem("lastVisitedFacilityId", facilityId);
    navigate(`/monitoring/${facilityId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const facilities = data?.facilities?.facilities || [];

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Facility Name</StyledTableCell>
              <StyledTableCell>Nominal Power</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility) => (
              <StyledTableRow
                key={facility.id}
                onClick={() => handleRowClick(facility.id)}
              >
                <StyledTableCell component="th" scope="row">
                  {facility.name}
                </StyledTableCell>
                <StyledTableCell>{facility.nominalPower}</StyledTableCell>
                <StyledTableCell>
                  <Fab
                    color="secondary"
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleOpenDialog(facility.id);
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </Fab>
                  <Fab
                    color="error"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDelete(facility.id);
                    }}
                    size="small"
                    style={{ marginLeft: 8 }}
                  >
                    <DeleteIcon />
                  </Fab>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog()}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingFacilityId ? "Edit Facility" : "Add New Facility"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Facility Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nominal Power"
            type="number"
            fullWidth
            variant="standard"
            value={nominalPower}
            onChange={(e) => setNominalPower(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {editingFacilityId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
