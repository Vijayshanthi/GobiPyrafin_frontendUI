import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Dialog from "@mui/material/Dialog";
import moment from "moment";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Grid } from "@mui/material";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExpenseRecord({
  totalExpenseDetails,
  totalIndirectExpenseDetails,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [deleteopen, setdeleteOpen] = React.useState(false);
  const [deleteid, setDeleteId] = useState(0);

  let updatedrow = [];
  const [rows, setRows] = useState([]);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [rowModesModel, setRowModesModel] = useState({});
  const [validationError, setValidationError] = useState("");
  const [actionTake, setActionTake] = useState(false);
  const [adddetails, setAddDetails] = useState({
    id: "",
    InvoiceNumber: "",
    Particulars: "",
    Amount: "",
    CGST: "",
    CGSTPercentage: "",
    SGST: "",
    SGSTPercentage: "",
    IGST: "",
    IGSTPercentage: "",
    PaymentType: "",
    AccountType: "",
    Section: "",
    TDS: "",
    TDSAmount: "",
    TDSStatus: "",
    Status: "",
    DueDate: "",
    ActionDate: "",
    TotalAmount: 0,
    BalanceDue: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  function calculateTDS(selectedSection) {
    switch (selectedSection) {
      case "192-Salaries":
        return 0;
      case "193-Interest on debentures":
        return 10;
      case "194-Deemed dividend":
        return 10;
      case "194A-Interest other than Int. on securities (by Bank)":
        return 10;
      case "194A-Interest other than Int. on securities (By others)":
        return 10;
      case "194B-Lottery / Cross Word Puzzle":
        return 30;
      case "194BB-Winnings from Horse Race":
        return 30;
      case "194C(1)-Contracts":
        return 2;
      case "194C(2)-Sub-contracts/ Advertisements":
        return 2;
      case "194D-Insurance Commission":
        return 10;
      case "194EE-Payments out of deposits under NSS":
        return 20;
      case "194F-Repurchase of units by MF/UTI":
        return 20;
      case "194G-Commission on sale of lottery tickets":
        return 10;
      case "194H-Commission or Brokerage":
        return 10;
      case "194I-Rent (Land & building) furniture & fittings":
        return 10;
      case "194F-Rent (P & M , Equipment)":
        return 2;
      case "194 IA-TDS on transfer of immovable property other than agriculture land (wef 01.06.13)":
        return 1;
      case "194J-Professional/Technical charges/ Royalty & Non-compete fees":
        return 10;
      case "194J(1)(ba)-Any remuneration or commission paid to director of the company(Effective from 1 July 2012)":
        return 10;
      case "194LA-Compensation on acquisition of immovable property":
        return 10;
      default:
        return 0;
    }
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActionTake(false);
    setAddDetails({
      InvoiceNumber: "",
      Particulars: "",
      Amount: "",
      CGST: "",
      CGSTPercentage: "",
      SGST: "",
      SGSTPercentage: "",
      IGST: "",
      IGSTPercentage: "",
      PaymentType: "",
      AccountType: "",
      Section: "",
      TDS: "",
      TDSAmount: "",
      TDSStatus: "",
      Status: "",
      DueDate: "",
      ActionDate: "",
      TotalAmount: 0,
      BalanceDue: 0,
    });
  };

  const handleaddExpense = () => {
    if (
      adddetails.InvoiceNumber == "" ||
      adddetails.Particulars == "" ||
      adddetails.Amount == 0 ||
      adddetails.PaymentType == "" ||
      adddetails.AccountType == "" ||
      adddetails.Status == "" ||
      adddetails.TDSStatus == "" ||
      adddetails.DueDate == "" ||
      adddetails.ActionDate == ""
    ) {
      alert(`Mandatory fields should not be empty`);
    } else {
      if (adddetails.ActionDate <= adddetails.DueDate) {
        const total =
          Number((adddetails.CGSTPercentage / 100) * adddetails.Amount) +
          Number((adddetails.SGSTPercentage / 100) * adddetails.Amount) +
          Number((adddetails.IGSTPercentage / 100) * adddetails.Amount) +
          adddetails.Amount;

        const tdsamount = (adddetails.TDS / 100) * adddetails.Amount;
        setAddDetails({
          ...adddetails,
          TotalAmount: total,
          BalanceDue: total,
          TDSAmount: tdsamount,
        });

        if (actionTake) {
          if (adddetails.TDSStatus == "Applicable") {
            updateAPIExpense(adddetails.id, {
              ...adddetails,
              TotalAmount: total - tdsamount,
              BalanceDue: total - tdsamount,
              CGST: Number(
                (adddetails.CGSTPercentage / 100) * adddetails.Amount
              ),
              SGST: Number(
                (adddetails.SGSTPercentage / 100) * adddetails.Amount
              ),
              IGST: Number(
                (adddetails.IGSTPercentage / 100) * adddetails.Amount
              ),
              TDS: Number(adddetails.TDS),
              TDSAmount: tdsamount,
            });
          } else {
            updateAPIExpense(adddetails.id, {
              ...adddetails,
              TotalAmount: total,
              BalanceDue: total,
              CGST: Number(
                (adddetails.CGSTPercentage / 100) * adddetails.Amount
              ),
              SGST: Number(
                (adddetails.SGSTPercentage / 100) * adddetails.Amount
              ),
              IGST: Number(
                (adddetails.IGSTPercentage / 100) * adddetails.Amount
              ),
              TDS: Number(adddetails.TDS),
              TDSAmount: tdsamount,
            });
          }
        } else {
          if (adddetails.TDSStatus == "Applicable") {
            addAPIExpense({
              ...adddetails,
              TotalAmount: total - tdsamount,
              BalanceDue: total - tdsamount,
              CGST: Number(
                (adddetails.CGSTPercentage / 100) * adddetails.Amount
              ),
              SGST: Number(
                (adddetails.SGSTPercentage / 100) * adddetails.Amount
              ),
              IGST: Number(
                (adddetails.IGSTPercentage / 100) * adddetails.Amount
              ),
              TDS: Number(adddetails.TDS),
              TDSAmount: tdsamount,
            });
          } else {
            addAPIExpense({
              ...adddetails,
              TotalAmount: total,
              BalanceDue: total,
              CGST: Number(
                (adddetails.CGSTPercentage / 100) * adddetails.Amount
              ),
              SGST: Number(
                (adddetails.SGSTPercentage / 100) * adddetails.Amount
              ),
              IGST: Number(
                (adddetails.IGSTPercentage / 100) * adddetails.Amount
              ),
              TDS: Number(adddetails.TDS),
              TDSAmount: tdsamount,
            });
          }
        }
      } else {
        window.alert("Invoice date should be less than or equal to due date");
      }
    }
  };

  const updateAPIExpense = async (id, newData) => {
    console.log(newData);
    await axios({
      url: `http://188.166.228.50:8089/expense/updateexpense/${id}`,
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
      data: newData,
    })
      .then((response) => {
        if (response.status == 200) {
          window.alert("Expense Updated Successfully");
          totalExpenseDetails();
          totalIndirectExpenseDetails();
          getExpenseRecord();
          setActionTake(false);
          setOpen(false);
          setAddDetails({
            id: "",
            InvoiceNumber: "",
            Particulars: "",
            Amount: "",
            CGST: "",
            CGSTPercentage: "",
            SGST: "",
            SGSTPercentage: "",
            IGST: "",
            IGSTPercentage: "",
            PaymentType: "",
            AccountType: "",
            Section: "",
            TDS: "",
            TDSAmount: "",
            TDSStatus: "",
            Status: "",
            DueDate: "",
            ActionDate: "",
            TotalAmount: 0,
            BalanceDue: 0,
          });
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          window.alert("Record Already Exists");
        } else if (err && err.response.status == 401) {
          navigate("/login");
        } else if (err.response && err.response.status == 500) {
          console.log(err);
          console.log(
            ` ${
              err.response && err.response.data && err.response.data.msg
            } in ${err.response.data.path}`
          );
          window.alert(
            ` ${
              err.response && err.response.data && err.response.data.msg
            } in ${err.response.data.path}`
          );
        }
      });
  };

  const addAPIExpense = async (newData) => {
    await axios({
      url: `http://188.166.228.50:8089/expense/addexpense`,
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
      data: newData,
    })
      .then((response) => {
        if (response.status == 200) {
          window.alert("Expense Created Successfully");
          totalExpenseDetails();
          totalIndirectExpenseDetails();
          getExpenseRecord();
          setOpen(false);
          setAddDetails({
            id: "",
            InvoiceNumber: "",
            Particulars: "",
            Amount: "",
            CGST: "",
            SGST: "",
            IGST: "",
            PaymentType: "",
            AccountType: "",
            Section: "",
            TDS: "",
            TDSAmount: "",
            TDSStatus: "",
            DueDate: "",
            ActionDate: "",
            TotalAmount: 0,
            BalanceDue: 0,
          });
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          window.alert("Record Already Exists");
        } else if (err && err.response.status == 401) {
          navigate("/login");
        } else if (err.response && err.response.status == 500) {
          window.alert(
            ` ${
              err.response && err.response.data && err.response.data.msg
            } in ${err.response.data.path}`
          );
        }
      });
  };

  const handleDeleteClose = () => {
    setdeleteOpen(false);
    getExpenseRecord();
  };

  const handleEditClick = (id) => {
    setActionTake(true);
    setOpen(true);
    updatedrow = rows.filter((e) => e.id == id);
    let updateduedate = moment(updatedrow[0].DueDate);
    let updateactiondate = moment(updatedrow[0].ActionDate);
    setAddDetails({
      ...updatedrow[0],
      DueDate: updateduedate.format("YYYY-MM-DD"),
      ActionDate: updateactiondate.format("YYYY-MM-DD"),
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setdeleteOpen(true);
  };

  const handleDelete = async (id) => {
    await axios({
      url: `http://188.166.228.50:8089/expense/deletesingleexpenserecord/${id}`,
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
    })
      .then((response) => {
        if (response) {
          window.alert("Expense deleted");
          totalExpenseDetails();
          totalIndirectExpenseDetails();
          setdeleteOpen(false);
          getExpenseRecord();
        }
      })
      .catch((err) => {
        if (err && err.response.status == 401) {
          navigate("/login");
        }
        window.alert("Failed to Delete");
      });
  };

  useEffect(() => {
    getExpenseRecord();
  }, []);
  const getExpenseRecord = async () => {
    await axios
      .get(`http://188.166.228.50:8089/expense/getexpensedetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      })
      .then((res) => {
        if (res && res.status == 401) {
          navigate("/login");
        }
        setRows(res.data);
      })
      .catch((err) => {
        if (err && err.response.status == 401) {
          navigate("/login");
        }
      });
  };

  const columns = [
    {
      field: "InvoiceNumber",
      headerName: (
        <div>
          <b>Invoice Number </b>
        </div>
      ),
      width: 150,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Particulars",
      headerName: (
        <div>
          <b>Particulars </b>
        </div>
      ),
      width: 200,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Section",
      headerName: (
        <div>
          <b>Section</b>
        </div>
      ),
      width: 200,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Amount",
      headerName: (
        <div>
          <b>Amount</b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "TDS",
      headerName: (
        <div>
          <b>TDS % </b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const value = params.value || 0;
        return (
          <span>
            <b>{value}</b>
          </span>
        );
      },
    },
    {
      field: "TDSAmount",
      headerName: (
        <div>
          <b> TDS Amount </b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "CGST",
      headerName: (
        <div>
          <b>CGST </b>
        </div>
      ),
      type: "number",
      width: 100,
      renderCell: (params) => (
        <div>
          {Number(params.value)} <br />
          {`(${params.row.CGSTPercentage})%`}
        </div>
      ),
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "left",
    },

    {
      field: "SGST",
      headerName: (
        <div>
          <b>SGST </b>
        </div>
      ),
      type: "number",
      width: 100,
      renderCell: (params) => (
        <div>
          {Number(params.value)} <br />
          {`(${params.row.SGSTPercentage})%`}
        </div>
      ),
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "left",
    },
    {
      field: "IGST",
      headerName: (
        <div>
          <b>IGST </b>
        </div>
      ),
      type: "number",
      width: 100,
      renderCell: (params) => (
        <div>
          {Number(params.value)} <br />
          {`(${params.row.IGSTPercentage})%`}
        </div>
      ),
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "left",
    },
    {
      field: "TotalAmount",
      headerName: (
        <div>
          <b>Total Amount </b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || 0;
        return (
          <span>
            <b>{value}</b>
          </span>
        );
      },
      headerClassName: "super-app-theme--header",
    },
    {
      field: "PaymentType",
      headerName: (
        <div>
          <b>Payment Type </b>
        </div>
      ),
      width: 160,
      editable: true,
      align: "left",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Direct", "Indirect"],
      headerClassName: "super-app-theme--header",
    },
    {
      field: "AccountType",
      headerName: (
        <div>
          <b>Account Type </b>
        </div>
      ),
      width: 160,
      editable: true,
      align: "left",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Cash", "Solution", "Workz", "Digital", "Director Fund"],
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Status",
      headerName: (
        <div>
          <b>Status</b>
        </div>
      ),
      width: 120,
      editable: true,
      headerAlign: "center",
      type: "singleSelect",
      renderCell: (params) => {
        const value = params.value;
        if (params.value == "Paid") {
        }
        let color = "green";
        if (params.value == "UnPaid") {
          color = "red";
        } else {
          color = "";
        }

        return (
          <div
            style={{
              color: value == "UnPaid" ? "red" : "green",
            }}
          >
            {value} &nbsp;
          </div>
        );
      },
      headerClassName: "super-app-theme--header",
    },
    {
      field: "TDSStatus",
      headerName: (
        <div>
          <b> TDS Status</b>
        </div>
      ),
      width: 120,
      editable: true,
      headerAlign: "center",
      type: "singleSelect",
      renderCell: (params) => {
        const value = params.value;
        if (params.value == "Applicable") {
        }
        let color = "green";
        if (params.value == "Not Applicable") {
          color = "red";
        } else {
          color = "";
        }

        return (
          <div
            style={{
              color: value == "Not Applicable" ? "red" : "green",
            }}
          >
            {value} &nbsp;
          </div>
        );
      },
      headerClassName: "super-app-theme--header",
    },
    {
      field: "ActionDate",
      headerName: (
        <div>
          <b>Invoice Date </b>
        </div>
      ),
      type: "date",
      width: 150,
      align: "left",
      headerAlign: "center",
      editable: true,
      valueGetter: (params) => {
        const actionDate = params.row.ActionDate;
        if (actionDate === null || actionDate === undefined) {
          return new Date();
        }
        return new Date(actionDate);
      },

      headerClassName: "super-app-theme--header",
    },
    {
      field: "DueDate",
      headerName: (
        <div>
          <b>Due Date </b>
        </div>
      ),
      type: "date",
      width: 150,
      align: "left",
      headerAlign: "center",

      editable: true,
      valueGetter: (params) => {
        const dueDate = params.row.DueDate;
        if (dueDate === null || dueDate === undefined) {
          return null;
        }
        return new Date(dueDate);
      },
      min: { today },
      headerClassName: "super-app-theme--header",
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",

      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "#676767" }} />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: "#676767" }} />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            sx={{
              color: "#676767",
            }}
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        "& .super-app-theme--header": {
          backgroundColor: "Lightgrey",
          color: "Black",
          fontSize: "17px",
          border: "1px solid #fff",
          borderRadius: "5px",
        },
      }}
    >
      <Grid container>
        <Grid item lg={12}>
          <Button
            sx={{
              marginBottom: "50px",
              float: "right",
              right: "60px",
            }}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClick}
          >
            Add record
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      <Dialog
        fullWidth={fullWidth}
        maxWidth="md"
        open={open}
        onClose={handleClose}
      >
        <DialogContent fullWidth>
          <DialogContentText sx={{ fontWeight: 800 }}>
            {actionTake ? "Update Expense Details" : "Add Expense Details"}
          </DialogContentText>
          <Grid container lg={12} sx={{ display: "flex" }}>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Invoice Number <span style={{ color: "red" }}>*</span>
                  </span>
                }
                className="red-asterisk"
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    InvoiceNumber: e.target.value,
                  })
                }
                sx={{ marginBottom: "28px" }}
                value={adddetails.InvoiceNumber}
              />
              <div>
                <TextField
                  id="standard-number"
                  label={<span>CGST %</span>}
                  type="number"
                  variant="standard"
                  sx={{ marginBottom: "25px", width: 218 }}
                  className="red-asterisk"
                  onChange={(e) => {
                    if (
                      /^\d*\.?\d*$/.test(e.target.value) &&
                      parseFloat(e.target.value) >= 0
                    ) {
                      setAddDetails({
                        ...adddetails,
                        CGSTPercentage: Number(e.target.value),
                      });
                      setValidationError("");
                    } else {
                      setAddDetails({
                        ...adddetails,
                        CGSTPercentage: Number(e.target.value),
                      });
                      setValidationError("Please enter a positive number.");
                    }
                  }}
                  value={Number(adddetails.CGSTPercentage) || ""}
                />
                {validationError && (
                  <div style={{ color: "red" }}>{validationError}</div>
                )}
              </div>
              <FormControl sx={{ m: 1, minWidth: 220, marginBottom: "20px" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  placeholder="Payment Type"
                >
                  Payment Type <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.PaymentType}
                  label="Status"
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      PaymentType: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Direct"}>Direct</MenuItem>
                  <MenuItem value={"Indirect"}>InDirect</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 720, marginBottom: "20px" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  placeholder="Payment Type"
                >
                  Section <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.Section}
                  label="Section"
                  onChange={(e) => {
                    const selectedSection = e.target.value;
                    const tdsRate = calculateTDS(selectedSection);
                    const amount = adddetails.Amount || 0;
                    const tdsDeduction = (amount * tdsRate) / 100;
                    setAddDetails({
                      ...adddetails,
                      Section: selectedSection,
                      Amount: adddetails.Amount,
                      TDS: tdsRate,
                    });
                  }}
                >
                  <MenuItem value="">--select--</MenuItem>
                  <MenuItem value={"192-Salaries"}>192-Salaries</MenuItem>
                  <MenuItem value={"193-Interest on debentures"}>
                    193-Interest on debentures
                  </MenuItem>
                  <MenuItem value={"194-Deemed dividend"}>
                    194-Deemed dividend
                  </MenuItem>
                  <MenuItem
                    value={
                      "194A-Interest other than Int. on securities (by Bank)"
                    }
                  >
                    194A-Interest other than Int. on securities (by Bank)
                  </MenuItem>
                  <MenuItem
                    value={
                      "194A-Interest other than Int. on securities (By others)"
                    }
                  >
                    194A-Interest other than Int. on securities (By others)
                  </MenuItem>
                  <MenuItem value={"194B-Lottery / Cross Word Puzzle"}>
                    194B-Lottery / Cross Word Puzzle
                  </MenuItem>
                  <MenuItem value={"194BB-Winnings from Horse Race"}>
                    194BB-Winnings from Horse Race
                  </MenuItem>
                  <MenuItem value={"194C(1)-Contracts"}>
                    194C(1)-Contracts
                  </MenuItem>
                  <MenuItem value={"194C(2)-Sub-contracts/ Advertisements"}>
                    194C(2)-Sub-contracts/ Advertisements
                  </MenuItem>
                  <MenuItem value={"194D-Insurance Commission"}>
                    194D-Insurance Commission
                  </MenuItem>
                  <MenuItem value={"194EE-Payments out of deposits under NSS"}>
                    194EE-Payments out of deposits under NSS
                  </MenuItem>
                  <MenuItem value={"194F-Repurchase of units by MF/UTI"}>
                    194F-Repurchase of units by MF/UTI
                  </MenuItem>
                  <MenuItem
                    value={"194G-Commission on sale of lottery tickets"}
                  >
                    194G-Commission on sale of lottery tickets
                  </MenuItem>
                  <MenuItem value={"194H-Commission or Brokerage"}>
                    194H-Commission or Brokerage
                  </MenuItem>
                  <MenuItem value={"194F-Repurchase of units by MF/UTI"}>
                    194F-Repurchase of units by MF/UTI
                  </MenuItem>
                  <MenuItem
                    value={"194I-Rent (Land & building) furniture & fittings"}
                  >
                    194I-Rent (Land & building) furniture & fittings
                  </MenuItem>
                  <MenuItem value={"194F-Rent (P & M , Equipment)"}>
                    194F-Rent (P & M , Equipment)
                  </MenuItem>
                  <MenuItem
                    value={
                      "194 IA-TDS on transfer of immovable property other than agriculture land (wef 01.06.13)"
                    }
                  >
                    194 IA-TDS on transfer of immovable property other than
                    agriculture land (wef 01.06.13)
                  </MenuItem>
                  <MenuItem
                    value={
                      "194J-Professional/Technical charges/ Royalty & Non-compete fees"
                    }
                  >
                    194J-Professional/Technical charges/ Royalty & Non-compete
                    fees
                  </MenuItem>
                  <MenuItem
                    value={
                      "194J(1)(ba)-Any remuneration or commission paid to director of the company(Effective from 1 July 2012)"
                    }
                  >
                    194J(1)(ba)-Any remuneration or commission paid to director
                    of the company(Effective from 1 July 2012)
                  </MenuItem>
                  <MenuItem
                    value={
                      "194LA-Compensation on acquisition of immovable property"
                    }
                  >
                    194LA-Compensation on acquisition of immovable property
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="standard-number"
                label={<span>TDS %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "45px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    TDS: Number(e.target.value),
                  })
                }
                value={Number(adddetails.TDS) || ""}
              />
              <label htmlFor="">
                {" "}
                InvoiceDate <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                type="date"
                label="ActionDate"
                style={{ width: "200px", height: "60px" }}
                value={adddetails.ActionDate}
                onChange={(e) =>
                  setAddDetails({ ...adddetails, ActionDate: e.target.value })
                }
              ></input>
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Particulars <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Particulars: e.target.value,
                  })
                }
                sx={{ marginBottom: "26px" }}
                value={adddetails.Particulars}
              />

              <TextField
                id="standard-number"
                label={<span>SGST %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "25px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    SGSTPercentage: Number(e.target.value),
                  })
                }
                value={Number(adddetails.SGSTPercentage) || ""}
              />
              <FormControl sx={{ m: 1, minWidth: 220, marginBottom: "107px" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  placeholder="Payment Type"
                >
                  Account Type <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.AccountType}
                  label="Status"
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      AccountType: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Cash"}>Cash</MenuItem>
                  <MenuItem value={"Solution"}>Solution</MenuItem>
                  <MenuItem value={"Workz"}>Workz</MenuItem>
                  <MenuItem value={"Digital"}>Digital</MenuItem>
                  <MenuItem value={"Director Fund"}>Director Fund</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 250, marginBottom: "28px" }}>
                <InputLabel id="demo-simple-select-label">
                  TDS Status <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.TDSStatus}
                  label="TDSStatus"
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      TDSStatus: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Applicable"}>Applicable</MenuItem>
                  <MenuItem value={"Not Applicable"}>Not Applicable</MenuItem>
                </Select>
              </FormControl>
              <label htmlFor="">
                {" "}
                DueDate<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                type="date"
                label={adddetails.DueDate}
                style={{ width: "200px", height: "60px" }}
                value={adddetails.DueDate}
                onChange={(e) =>
                  setAddDetails({ ...adddetails, DueDate: e.target.value })
                }
              ></input>
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="standard-number"
                label={
                  <span>
                    Amount <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginTop: "10px", marginBottom: "26px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Amount: Number(e.target.value),
                  })
                }
                value={adddetails.Amount || ""}
              />

              <TextField
                id="standard-number"
                label={<span>IGST %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "25px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    IGSTPercentage: Number(e.target.value),
                  })
                }
                value={Number(adddetails.IGSTPercentage) || ""}
              />
              <FormControl sx={{ m: 1, minWidth: 250, marginBottom: "105px" }}>
                <InputLabel id="demo-simple-select-label">
                  Status <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.Status}
                  label="Status"
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      Status: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Paid"}>Paid</MenuItem>
                  <MenuItem value={"UnPaid"}>UnPaid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            sx={{ background: "Light grey" }}
            variant="contained"
            onClick={() => handleaddExpense()}
          >
            {actionTake ? "UPDATE" : "ADD"}
          </Button>
          <Button onClick={() => handleClose()} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteopen}
        onClose={handleDeleteClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "red" }}
            autoFocus
            onClick={() => handleDelete(deleteid)}
          >
            Yes
          </Button>
          <Button onClick={() => handleDeleteClose()} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
