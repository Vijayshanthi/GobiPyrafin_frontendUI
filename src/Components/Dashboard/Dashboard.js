import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import "./Dashboard.css";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Menu, MenuItem } from "@mui/material";
import Axios from "axios";
import ApiCalls from "../../API/ApiCalls";
import { useMemo } from "react";
import { Date } from "core-js";
import IncomeImg from "../../assets/Images/income.png";
import ExpenseImg from "../../assets/Images/expense.png";
import PfImg from "../../assets/Images/profit and loss.png";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import your CSS file
import Avatar from '@mui/material/Avatar';


const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [newRowData, setNewRowData] = useState({
    account: "",
    limit_amount: "",
    balance: "",
    date: "",
  });

  const [editMode, setEditMode] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const style = totalIncome - totalExpense < 0 ? "redcolor" : "greencolor";

  const handleAddRow = () => {
    setNewRowData({
      account: "",
      limit_amount: "",
      balance: "",
      date: "",
    });
    setAddDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "account") {
      setNewRowData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "limit_amount" || name === "balance") {
      if (!isNaN(value)) {
        setNewRowData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "date") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        setNewRowData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const isValidData = () => {
    if (
      newRowData.account &&
      newRowData.limit_amount &&
      newRowData.balance &&
      newRowData.date
    ) {
      return true;
    }
    return false;
  };


  const handleAddButtonClick = async () => {
    const newData = {
      account: newRowData.account,
      limit_amount: newRowData.limit_amount,
      balance: newRowData.balance,
      date: newRowData.date,
    };

    if (
      newData.account &&
      newData.limit_amount &&
      newData.balance &&
      newData.date
    )
    
    {
      try {
        await Axios({
          url: "http://188.166.228.50:8089/account/api/account-summary",
          method: "post",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
          data: newData,
        }).then((response) => {
          if (response.status === 200) {
            setTableData((prevTableData) => [...prevTableData, newData]);
            setAddDialogOpen(false);
          } else {
            console.error("Error adding data to the API");
          }
        });
      } catch (error) {
        if (error && error.response.status == 401) {
          navigate("/login");
        }
      }
    } else {
      console.error("All fields are required!");
    }
  };

  const toggleEditMode = (index) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [index]: !prevEditMode[index],
    }));
  };

  const handleRowInputChange = async (event, index) => {
    const { name, value } = event.target;
    // Regular expressions for validation
    const accountRegex = /^[A-Za-z0-9]+$/;
    const amountRegex = /^[0-9]+$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let updatedTableData = [...tableData];
    // Validate input values based on their names
    if (name === "account" && !accountRegex.test(value)) {
      // Invalid account format
      console.error("Invalid account format. Use only letters and numbers.");
      return;
    } else if (
      (name === "limit_amount" || name === "balance") &&
      !amountRegex.test(value)
    ) {
      // Invalid amount format
      console.error("Invalid amount format. Use only numbers.");
      return;
    } else if (name === "date" && !dateRegex.test(value)) {
      // Invalid date format
      console.error("Invalid date format. Use YYYY-MM-DD format.");
      return;
    }
    updatedTableData[index] = {
      ...updatedTableData[index],
      [name.split("-")[0]]: value,
    };
    if (editMode[index]) {
      try {
        await Axios({
          url: `http://188.166.228.50:8089/account/api/account-summary/${updatedTableData[index].id}`,
          method: "put",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
          data: {
            account: updatedTableData[index].account,
            limit_amount: updatedTableData[index].limit_amount,
            balance: updatedTableData[index].balance,
            date: updatedTableData[index].date,
          },
        }).then((response) => {
          if (response.status === 200) {
          } else if (
            response &&
            response.response &&
            response.response.status == 401
          ) {
            navigate("/login");
          } else {
            console.error("Error updating record");
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setTableData(updatedTableData);
  };

  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);

  const handleDownloadClick = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet([
      ["Account", "Limit", "Balance", "Date"],
      ...tableData.map((row) => [
        row.account,
        row.limit_amount,
        row.balance,
        new Date(row.date).toLocaleDateString(),
      ]),
      [
        "Total",
        calculateTotal().totalLimit,
        calculateTotal().totalBalance,
        "-",
      ],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");
    XLSX.writeFile(wb, "Account_summary.xlsx");
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Account Summary", 10, 10);
    const columns = ["Account", "Limit", "Balance", "Date"];
    const data = tableData.map((row) => [
      row.account,
      row.limit_amount,
      row.balance,
      new Date(row.date).toLocaleDateString(),
    ]);

    const totalRow = [
      "Total",
      calculateTotal().totalLimit,
      calculateTotal().totalBalance,
      "-",
    ];
    data.push(totalRow);
    const margin = 10;
    doc.autoTable({
      head: [columns],
      body: data,
      startY: 20,
      margin: { top: margin },
    });
    doc.save("Account_summary.pdf");
  };

  const fetchData = async () => {
    try {
      await Axios({
        url: "http://188.166.228.50:8089/account/api/account-summary",
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setTableData(response.data);
        } else {
          console.error("Error fetching data from the API");
        }
      });
    } catch (error) {
      if (error && error.response.status == 401) {
        navigate("/login");
      } else {
        console.error("All fields are required!");
      }
    }
  };

  const handleDeleteRow = async (index, accountId) => {
    try {
      await Axios({
        url: `http://188.166.228.50:8089/account/api/account-summary/${accountId}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      }).then((response) => {
        if (!accountId) {
          const updatedTableData = [...tableData];
          updatedTableData.splice(index, 1);
          setTableData(updatedTableData);
        } else {
          if (response.status == 200) {
            fetchData();
          } else {
            console.error("Error deleting data from the API");
          }
        }
      });
    } catch (error) {
      if (error && error.response.status == 401) {
        navigate("/login");
      } else {
        console.error("All fields are required!");
      }
    }
  };
  const calculateTotal = () => {
    let totalLimit = 0;
    let totalBalance = 0;
    for (const row of tableData) {
      totalLimit += parseFloat(row.limit_amount);
      totalBalance += parseFloat(row.balance);
    }
    return { totalLimit, totalBalance };
  };

  useEffect(() => {
    fetchData();
  }, []);
  const gettotalIncome = async () => {
    await ApiCalls.getTotalIncome()
      .then((res) => {
        if (
          (res && res.status == 401) ||
          (res.response && res.response.status == 401)
        ) {
          navigate("/login");
        }
        setTotalIncome(res.data?.Total);
      })
      .catch((err) => console.log(err));
  };

  const gettotalExpense = async () => {
    await ApiCalls.getTotalExpense()
      .then((res) => {
        if (res && res.response && res.response.status == 401) {
          window.alert("Invalid user");
          navigate("/login");
        }
        setTotalExpense(res.data?.Total);
      })
      .catch((err) => console.log(err));
  };
  useMemo(() => {
    gettotalIncome();
  }, []);

  useMemo(() => {
    gettotalExpense();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Container>
          <Typography
            sx={{
              fontSize: "200%",
              color: "secondary",
              padding: "10px",
              fontFamily: 'Vazir',
              color: "Black",
              fontWeight: "bold",
            }}
          >
            DASHBOARD
          </Typography>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  width: "250px",
                  boxShadow: "10px 10px 4px 0px #00000050",
                  borderRadius: "18px",
                  display: { xs: "block", md: "block" },
                  height: "100px",
                  paddingLeft: "20px",
                  background: "white",
                  color: "Black",
                  marginLeft: "40px",
                  paddingTop: "10px",
                  marginRight: "30px",
                  Fontweight: "Bold",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: "20px", xs: "1rem" },
                    color: "secondary",
                    padding: "10px",
                    fontFamily: 'Vazir',
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  Income

                  <div style={{ float: "right", width: "70%", textAlign: "right" }}>
                  <img src={IncomeImg} alt="" style={{  height: "40px" }} /></div>
                </Typography>

                <Typography
                  sx={{
                    color: "Black",
                    fontSize: { md: "20px", xs: "2rem" },
                    color: "secondary",
                    padding: "10px",
                    fontFamily: 'Vazir',
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  Rs.{totalIncome}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  width: "250px",
                  boxShadow: "10px 10px 4px 0px #00000050",

                  borderRadius: "20px",
                  display: { xs: "block", md: "block" },
                  height: "100px",
                  paddingLeft: "20px",
                  background: "White",
                  color: "Black",
                  marginLeft: "20px",
                  paddingTop: "10px",
                  marginRight: "30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: "20px", xs: "1rem" },
                    color: "secondary",
                    padding: "10px",
                    fontFamily: 'Vazir',
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  Expenses
                  <div style={{ float: "right", width: "50%", textAlign: "right" }}>

                  <img src={ExpenseImg} alt="" style={{  height: "60px" }}/></div>
                </Typography>

                <Typography
                  sx={{
                    color: "Black",
                    fontSize: { md: "20px", xs: "2rem" },
                    color: "secondary",
                    padding: "10px",
                    fontFamily: 'Vazir',
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  Rs.{totalExpense}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  width: "250px",
                  boxShadow: "10px 10px 4px 0px #00000050",

                  marginTop: "0px",

                  borderRadius: "20px",
                  display: { xs: "block", md: "block" },
                  height: "100px",
                  paddingLeft: "20px",
                  background: "white",
                  color: "Black",
                  marginLeft: "20px",
                  paddingTop: "10px",
                  marginRight: "30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: "20px", xs: "1rem" },
                    color: "secondary",
                    padding: "10px",
                    fontFamily: 'Vazir',
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  Profit/Loss
                  <div style={{ float: "right", width: "50%", textAlign: "right" }}>

                  <img src={PfImg} alt="" style={{ height: "60px" }} /> </div>
                </Typography>

                <Typography
                  className={style}
                  sx={{
                    color: "Black",
                    fontSize: { md: "20px", xs: "2rem" },
                    color: "secondary",
                    padding: "10px",
                    fontFamily: 'Vazir',
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  {totalIncome - totalExpense}
                </Typography>
              </Box>
            </Grid>
          </div>
          <div>
            <h1 style={{ fontFamily: "Young Serif" }}>Account Summary</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
               <Button
                   variant="contained"
                   color="primary"
                   startIcon={<AddIcon />}
                   onClick={handleAddRow}
              >
                    Add Data
              </Button>
              </div>
              <div>
                <IconButton
                  aria-label="Download"
                  onClick={handleDownloadClick}
                  style={{
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <GetAppIcon />
                </IconButton>

                <Menu
                  anchorEl={downloadMenuAnchor}
                  open={Boolean(downloadMenuAnchor)}
                  onClose={handleDownloadMenuClose}
                >
                  <MenuItem onClick={generatePdf}>Download as PDF</MenuItem>
                  <MenuItem onClick={handleExportToExcel}>
                    Download as Excel
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <TableContainer
              style={{
                border: "3px solid #000000",
                width: "100%",
                overflowX: "auto",
                marginBottom: "20px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        background: "Lightgrey"
                      }}
                    >
                      Account
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        background: "Lightgrey"
                      }}
                    >
                      Limit
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        background: "Lightgrey"
                      }}
                    >
                      Balance
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        background: "Lightgrey"
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        background: "Lightgrey"
                      }}
                    >
                      Edit
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody
  style={{
    fontWeight: "bold",
    fontSize: "20px",
  }}
>
  {Array.isArray(tableData) && tableData.length > 0 ? (
    tableData.map((row, index) => (
      <TableRow key={index}>
        {/* Your mapping logic here */}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5}>No data available</TableCell>
    </TableRow>
  )}
  <TableRow>
    <TableCell
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        background: "light grey",
      }}
    >
      Total
    </TableCell>
    <TableCell
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        background: "light grey",
      }}
    >
      {calculateTotal().totalLimit}
    </TableCell>
    <TableCell
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        background: "light grey",
      }}
    >
      {calculateTotal().totalBalance}
    </TableCell>
    <TableCell
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        background: "light grey",
      }}
    >
      -
    </TableCell>
    <TableCell
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        background: "light grey",
      }}
    >
      -
    </TableCell>
  </TableRow>
</TableBody>

              </Table>
            </TableContainer>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onClose={() => setAddDialogOpen(false)}
          >
            <DialogTitle>Add a New Details    </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Enter the details for the new Add:
              </DialogContentText> <br/>

              <TextField
                name="account"
                placeholder="Account"
                borderRadius= '10px'
                value={newRowData.account}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginBottom: '10px', borderColor: newRowData.account ? 'initial' : 'red' }}  />

              <TextField
                name="limit_amount"
                placeholder="Limit"
                value={newRowData.limit_amount}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginBottom: '10px', borderColor: newRowData.limit_amount ? 'initial' : 'red' }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newRowData.account && newRowData.limit_amount) {
                    document.getElementById("balance").focus();
                  }
                }}
              /> 
              <TextField
                name="balance"
                placeholder="Balance"
                value={newRowData.balance}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginBottom: '10px', borderColor: newRowData.balance ? 'initial' : 'red' }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newRowData.balance) {
                    document.getElementById("date").focus();
                  }
                }}
              />
              <TextField
                name="date"
                placeholder="Date"
                type="date"
                value={newRowData.date}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginBottom: '10px', borderColor: newRowData.balance ? 'initial' : 'red' }}

              />
                      {error && <Typography color="error">{error}</Typography>}

            </DialogContent>
            <DialogActions>
            <Button onClick={handleAddButtonClick} disabled={!isValidData()}>Add</Button>
            <Button onClick={() => setAddDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </ThemeProvider >
  );
};

export default Dashboard;
