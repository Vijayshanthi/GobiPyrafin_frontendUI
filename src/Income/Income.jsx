import * as React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import axios from "axios";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const lastTwoDigitsCurrentYear = currentYear % 100;
const lastTwoDigitsNextYear = nextYear % 100;

export default function Income({ totalIncomecall, totalunpaidincomecall }) {
  const [open, setOpen] = React.useState(false);
  const [deleteopen, setdeleteOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [deleteid, setDeleteId] = useState(0);
  const [rows, setRows] = useState([]);

  let updatedrow = [];
  const navigate = useNavigate();

  const [rowModesModel, setRowModesModel] = useState({});
  const [actionTake, setActionTake] = useState(false);
  let initialvalue = {
    InvoiceNumber: "",
    CompanyName: "",
    StreetAddress: "",
    City: "",
    Pincode: "",
    State: "",
    PlaceofSupply: "",
    Particulars: "",
    PSYear: `${lastTwoDigitsCurrentYear}-${lastTwoDigitsNextYear}`,
    Items: "",
    HSNSAC: "",
    Rate: "",
    CGST: "",
    CGSTPercentage: "",
    SGST: "",
    SGSTPercentage: "",
    IGST: "",
    IGSTPercentage: "",
    Status: "",
    DueDate: "",
    ActionDate: "",
    GSTIN: "",
    BankName: "ICICI Bank Nugapakkam",
    Branch: "Chennai",
    BeneficiaryName: "Pyramidion Solutions Private Limited",
    AccountDetails: "Current",
    ACNO: "000905027741",
    IFSCCode: "ICIC0000009",
    TotalAmount: 0,
    BalanceDue: 0,
  };
  const [adddetails, setAddDetails] = useState(initialvalue);
  const today = new Date().toISOString().split("T")[0];

  const handleaddIncome = async () => {
    if (
      adddetails.InvoiceNumber == "" ||
      adddetails.CompanyName == "" ||
      adddetails.StreetAddress == "" ||
      adddetails.City == "" ||
      adddetails.State == "" ||
      adddetails.Pincode == "" ||
      adddetails.PlaceofSupply == "" ||
      adddetails.GSTIN == "" ||
      adddetails.Particulars == "" ||
      adddetails.Items == "" ||
      adddetails.HSNSAC == "" ||
      adddetails.Rate == "" ||
      adddetails.DueDate == "" ||
      adddetails.ActionDate == "" ||
      adddetails.Status == ""
    ) {
      alert(`Mandatory fields should not be empty`);
    } else {
      if (adddetails.ActionDate <= adddetails.DueDate) {
        const total =
          (adddetails.CGSTPercentage / 100) * adddetails.Rate +
          (adddetails.SGSTPercentage / 100) * adddetails.Rate +
          (adddetails.IGSTPercentage / 100) * adddetails.Rate +
          adddetails.Rate;
        setAddDetails({
          ...adddetails,
          TotalAmount: total,
          BalanceDue: total,
        });
        if (actionTake) {
          updateApiIncomeData(adddetails.id, {
            ...adddetails,
            TotalAmount: total,
            BalanceDue: total,
            CGST: Number((adddetails.CGSTPercentage / 100) * adddetails.Rate),
            SGST: Number((adddetails.SGSTPercentage / 100) * adddetails.Rate),
            IGST: Number((adddetails.IGSTPercentage / 100) * adddetails.Rate),
          });
        } else {
          addApiIncomeData({
            ...adddetails,
            TotalAmount: total,
            BalanceDue: total,
            CGST: Number((adddetails.CGSTPercentage / 100) * adddetails.Rate),
            SGST: Number((adddetails.SGSTPercentage / 100) * adddetails.Rate),
            IGST: Number((adddetails.IGSTPercentage / 100) * adddetails.Rate),
          });
        }
      } else {
        window.alert("Invoice date should be less than or equal to due date");
      }
    }
  };
  const addApiIncomeData = async (newData) => {
    await axios({
      url: "http://188.166.228.50:8089/income/addincome",
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
      data: newData,
    })
      .then((response) => {
        if (response.status == 200) {
          window.alert("Income Inserted");
          totalIncomecall();
          totalunpaidincomecall();
          setActionTake(false);
          setOpen(false);
          getIncomeRecord();
          setAddDetails({ ...initialvalue, id: "" });
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          window.alert("Income Already Exists");
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

  const updateApiIncomeData = async (id, newData) => {
    await axios({
      url: `http://188.166.228.50:8089/income/updateincome/${id}`,
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
      data: newData,
    })
      .then((response) => {
        if (response.status == 200) {
          window.alert("Income Updated");
          totalIncomecall();
          totalunpaidincomecall();
          setActionTake(false);
          setOpen(false);
          getIncomeRecord();
          setAddDetails({ ...initialvalue, id: "" });
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          window.alert("Income Record Already Exists");
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

  const handleClose = () => {
    setOpen(false);
    setAddDetails({ ...initialvalue, id: "" });
    setActionTake(false);
  };
  const handleDeleteClose = () => {
    setdeleteOpen(false);
  };
  const handleClick = () => {
    setOpen(true);
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
      url: `http://188.166.228.50:8089/income/deletesinglerecord/${id}`,
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
    })
      .then((response) => {
        if (response) {
          window.alert("Income deleted");
          getIncomeRecord();
          totalIncomecall();
          totalunpaidincomecall();
          setdeleteOpen(false);
        }
      })
      .catch((err) => {
        if (err && err.response.status == 401) {
          navigate("/login");
        }
        window.alert("Failed to Delete");
      });
  };
  const handleDownloadClick = async (id) => {
    await axios({
      url: `http://188.166.228.50:8089/income/generateinvoice/${id}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
    })
      .then((res) => {
        if (res.status == 200 || 201) {
          setTimeout(() => {
            window.open(
              `http://188.166.228.50:8089/file/${res.data.fileName}`,
              "__blank"
            );
          }, 3000);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => window.alert("Download Failed!Try again!"));
  };

  const generatereceipt = async (id) => {
    await axios({
      url: `http://188.166.228.50:8089/income/generatereceipt/${id}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
      },
    })
      .then((res) => {
        if (res.status == 200 || 201) {
          setTimeout(() => {
            window.open(
              `http://188.166.228.50:8089/file/${res.data.fileName}`,
              "__blank"
            );
          }, 3000);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => window.alert("Download Failed!Try again!"));
  };

  useEffect(() => {
    getIncomeRecord();
  }, []);

  const getIncomeRecord = async () => {
    await axios
      .get(`http://188.166.228.50:8089/income/getincomedetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      })
      .then((res) => {
        if (res && res.response && res.response.status == 401) {
          navigate("/login");
        }
        setRows(res.data);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      field: "InvoiceNumber",
      headerName: (
        <div>
          <b>Invoice Number </b>
        </div>
      ),
      headerAlign: "center",
      width: 150,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "CompanyName",
      headerName: (
        <div>
          <b>Company Name </b>
        </div>
      ),
      headerAlign: "center",
      width: 200,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Particulars",
      headerName: (
        <div>
          <b>Particulars</b>
        </div>
      ),
      headerAlign: "center",
      width: 180,
      editable: true,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "Rate",
      headerName: (
        <div>
          <b>Rate</b>
        </div>
      ),
      type: "number",
      width: 120,
      editable: true,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",

      align: "left",
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
          <b>Total Amount</b>
        </div>
      ),
      type: "number",
      width: 150,
      editable: true,
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

      align: "left",
    },
    {
      field: "BalanceDue",
      headerName: (
        <div>
          <b>Balance Due</b>
        </div>
      ),
      type: "number",
      width: 150,
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "left",
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
        if (params.value == "UnPaid" || "Overdue" || "Declined") {
          color = "red";
        } else {
          color = "";
        }

        return (
          <div
            style={{
              color:
                value == "UnPaid" || value == "Overdue" || value == "Declined"
                  ? "red"
                  : "green",
            }}
          >
            {value} &nbsp;
            {value == "Paid" && (
              <span
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid blue",
                  color: "blue",
                }}
                onClick={() => generatereceipt(params.id)}
              >
                {" "}
                receipt
              </span>
            )}
          </div>
        );
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
      width: 130,
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
      field: "ActionDate",
      headerName: (
        <div>
          <b>Action Date</b>
        </div>
      ),
      type: "date",
      width: 130,
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
      min: { today },
      headerClassName: "super-app-theme--header",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        return [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "secondary" }} />}
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
          <GridActionsCellItem
            icon={<DownloadIcon sx={{ color: "#676767" }} />}
            label="Delete"
            onClick={() => handleDownloadClick(id)}
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
        width: "80%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        "& .super-app-theme--header": {
          backgroundColor: "lightgrey",
          color: "black",
          fontSize: "17px",
          border: "1px solid #fff",
          borderRadius: "5px",
        },
      }}
    >
      <Grid container>
        <Grid item lg={12} md={12} xs={12}>
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
        columnBuffer={5}
      />
      <Dialog
        fullWidth={fullWidth}
        maxWidth="md"
        open={open}
        onClose={handleClose}
      >
        <DialogContent fullWidth>
          <DialogContentText sx={{ fontWeight: 800 }}>
            {actionTake ? "Update Income Details" : "Add Income Details"}
          </DialogContentText>
          <Grid item lg={4} md={6} xs={8}>
            {" "}
            <TextField
              id="filled-basic"
              label={
                <span>
                  Invoice Number <span style={{ color: "black" }}>*</span>
                </span>
              }
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
          </Grid>
          <Grid container lg={12} md={12} sx={{ display: "flex" }}>
            <Grid item lg={4} md={6} xs={8}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Company Name <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    CompanyName: e.target.value,
                  })
                }
                sx={{ marginBottom: "28px" }}
                value={adddetails.CompanyName}
              />

              <TextField
                id="standard-number"
                label={
                  <span style={{ marginTop: -20 }}>
                    Pincode <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Pincode: Number(e.target.value),
                  })
                }
                value={adddetails.Pincode || ""}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    GSTIN <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    GSTIN: e.target.value,
                  })
                }
                value={adddetails.GSTIN}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Items <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Items: e.target.value,
                  })
                }
                value={adddetails.Items}
              />
              <TextField
                id="standard-number"
                label={<span>CGST %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "37px", width: 218 }}
                className="red-asterisk"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    CGSTPercentage: Number(e.target.value),
                  })
                }
                value={Number(adddetails.CGSTPercentage) || ""}
              />
              <FormControl sx={{ m: 1, minWidth: 250 }}>
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
                  <MenuItem value={"Overdue"}>Over Due</MenuItem>
                  <MenuItem value={"Declined"}>Declined</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Bank Name <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    BankName: e.target.value,
                  })
                }
                value={adddetails.BankName}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Account Details <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    AccountDetails: e.target.value,
                  })
                }
                value={adddetails.AccountDetails}
              />
            </Grid>
            <Grid item lg={4} md={6} xs={8}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Street Address <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    StreetAddress: e.target.value,
                  })
                }
                sx={{ marginBottom: "20px" }}
                value={adddetails.StreetAddress}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    State <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    State: e.target.value,
                  })
                }
                value={adddetails.State}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Particulars <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "28px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Particulars: e.target.value,
                  })
                }
                value={adddetails.Particulars}
              />
              <TextField
                id="standard-number"
                label={
                  <span>
                    HSNSAC <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    HSNSAC: Number(e.target.value),
                  })
                }
                value={adddetails.HSNSAC || ""}
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

              <div>
                <label htmlFor="">
                  {" "}
                  DueDate <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  type="date"
                  label="DueDate"
                  style={{
                    width: "200px",
                    height: "55px",
                    marginBottom: "14px",
                  }}
                  value={adddetails.DueDate}
                  onChange={(e) =>
                    setAddDetails({ ...adddetails, DueDate: e.target.value })
                  }
                ></input>
              </div>
              <TextField
                id="standard-number"
                label={
                  <span>
                    A/C No:<span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    ACNO: Number(e.target.value),
                  })
                }
                value={adddetails.ACNO || ""}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Branch <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Branch: e.target.value,
                  })
                }
                value={adddetails.Branch}
              />
            </Grid>
            <Grid item lg={4} md={6} xs={10}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    City <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    City: e.target.value,
                  })
                }
                value={adddetails.City}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Place of Supply <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    PlaceofSupply: e.target.value,
                  })
                }
                value={adddetails.PlaceofSupply}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    PS Year <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "28px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    PSYear: e.target.value,
                  })
                }
                value={adddetails.PSYear}
              />
              <TextField
                id="standard-number"
                label={
                  <span>
                    Rate <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Rate: Number(e.target.value),
                  })
                }
                value={Number(adddetails.Rate) || ""}
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

              <div>
                <label htmlFor="">
                  {" "}
                  InvoiceDate <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  type="date"
                  label="DueDate"
                  style={{
                    width: "200px",
                    height: "55px",
                    marginBottom: "10px",
                  }}
                  value={adddetails.ActionDate}
                  onChange={(e) =>
                    setAddDetails({ ...adddetails, ActionDate: e.target.value })
                  }
                ></input>
              </div>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Beneficiary Name <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    BeneficiaryName: e.target.value,
                  })
                }
                value={adddetails.BeneficiaryName}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    IFSC Code <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    IFSCCode: e.target.value,
                  })
                }
                value={adddetails.IFSCCode}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            sx={{ background: "#FBC91B" }}
            variant="contained"
            onClick={() => handleaddIncome()}
          >
            {actionTake ? "UPDATE" : "ADD"}
          </Button>
          <Button onClick={handleClose} autoFocus>
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
