import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
export default function Gst3B({
  totalExpenseDetails,
  totalIndirectExpenseDetails,
}) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [totalGST, setTotalGST] = useState(0); // State for the total GST
  const [itc, setITC] = useState(""); // State for ITC
  const [netPay, setNetPay] = useState(0);
  let totalGSTValue;
  console.log(rows, "rows");
  if (rows != []) {
    console.log(
      (rows[0] && rows[0].total) - (rows[1] && rows[1].total),
      "values"
    );
    totalGSTValue = (rows[0] && rows[0].total) - (rows[1] && rows[1].total);
  }
  React.useEffect(() => {
    // Fetch GST and Expense data
    Promise.all([getGstRecord(), getExpenseRecord()])
      .then(([gstData, expenseData]) => {
        if (gstData && expenseData) {
          const gstTotals = calculateTotals(gstData, "GST1");
          const expenseTotals = calculateTotals(expenseData, "GST2");
          console.log(gstTotals);
          console.log(expenseTotals);
          const totalGSTValue = gstTotals.Amount - expenseTotals.Amount;
          const totalGSTRow = {
            id: "totalGST",
            name: "Total GST",
            Amount: totalGSTValue,
          };
          console.log(totalGSTValue);
          setTotalGST(totalGSTValue);
          setRows([gstTotals, expenseTotals, totalGSTRow]);
        } else {
          // Handle the case when data is not available
          // For example, you can set an error message or handle it differently
          console.error("Data is not available");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      });
  }, []);


  const getGstRecord = () => {
    return axios
      .get(`http://localhost:8099/gst/getincomedetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      })
      .then((res) => {
        if (res && res.status == 401) {
          navigate("/login");
        }
        //setRows(res.data);
        var result = res.data,
          cgst = 0,
          sgst = 0,
          igst = 0;
        result.map((val, key) => {
          cgst += val["CGST"];
          sgst += val["SGST"];
          igst += val["IGST"];
        });
        setRows([
          {
            id: 1,
            name: "GST1",
            tot_inv: result.length,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            total: cgst + sgst + igst,
          },
        ]);
      })
      .catch((err) => {
        if (err && err.response.status == 401) {
          navigate("/login");
        }
      });
  };
  const getExpenseRecord = () => {
    return axios
      .get(`http://localhost:8099/expense/getexpensedetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      })
      .then((res) => {
        if (res && res.status === 401) {
          navigate("/login");
        }
        var result = res.data,
          cgst = 0,
          sgst = 0,
          igst = 0;
        result.forEach((val) => {
          cgst += val["CGST"];
          sgst += val["SGST"];
          igst += val["IGST"];
        });
        // Check if "GST2" is already in the rows, if not, add it.
        const existingGST2 = rows.find((row) => row.name === "GST2");
        if (existingGST2) {
          // Update the existing row with the new data
          existingGST2.tot_inv = result.length;
          existingGST2.cgst = cgst;
          existingGST2.sgst = sgst;
          existingGST2.igst = igst;
          existingGST2.total = cgst + sgst + igst;
        } else {
          // Add a new "GST2" row
          setRows((previousdata) => [
            ...previousdata,
            {
              id: 2,
              name: "GST2",
              tot_inv: result.length,
              cgst,
              sgst,
              igst,
              total: cgst + sgst + igst,
            },
          ]);
        }
      })
      .catch((err) => {
        if (err && err.response.status === 401) {
          navigate("/login");
        }
      });
  };
  const calculateTotals = (data, name) => {
    if (!data || data.length === 0) {
      return {
        id: name,
        name,
        InvoiceNumber: 0,
        CGST: 0,
        SGST: 0,
        IGST: 0,
        Amount: 0,
      };
    }
    let totalInvoiceNumber = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let totalAmount = 0;

    data.forEach((row) => {
      totalInvoiceNumber += row.InvoiceNumber || 0;
      totalCGST += row.CGST || 0;
      totalSGST += row.SGST || 0;
      totalIGST += row.IGST || 0;
      totalAmount += row.Amount || 0;
    });
    return {
      id: name,
      name,
      InvoiceNumber: totalInvoiceNumber,
      CGST: totalCGST,
      SGST: totalSGST,
      IGST: totalIGST,
      Amount: totalAmount,
    };
  };
  const columns = [
    {
      field: "Particular",
      headerName: (
        <div>
          <b>Particular</b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        return params.row.name;
      },
    },
    {
      field: "InvoiceNumber",
      headerName: (
        <div>
          <b>Total Invoice</b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        return params.row.tot_inv;
      },
    },
    {
      field: "CGST",
      headerName: (
        <div>
          <b>CGST</b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",


      valueGetter: (params) => {
        return params.row.cgst;
      },
    },
    {
      field: "SGST",
      headerName: (
        <div>
          <b>SGST</b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",

      valueGetter: (params) => {
        return params.row.sgst;
      },
    },
    {
      field: "IGST",
      headerName: (
        <div>
          <b>IGST</b>
        </div>
      ),
      type: "number",
      width: 130,
      editable: true,
      align: "left",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        return params.row.igst;
      },
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
      valueGetter: (params) => {
        // const CGST = params.row.CGST || 0;
        // const SGST = params.row.SGST || 0;
        // const IGST = params.row.IGST || 0;
        // return CGST + SGST + IGST;
        return params.row.total;
      },
    },
  ];
  const handleITCChange = (event) => {
    // Use a regular expression to allow only numbers
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setITC(input);
    }
  };
  const textFieldStyle = {
    marginTop: "20px",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold", // Replace "your-color-here" with the desired color
  };
  useEffect(() => {
    // Calculate net pay whenever totalGST or itc changes
    const totalGSTValue = parseFloat(totalGST) || 0;
    const itcValue = parseFloat(itc) || 0;
    const netPayValue = totalGSTValue - itcValue;
    setNetPay(netPayValue);
  }, [totalGST, itc]);
  return (
    <>
      <Grid container xs={12}>
        <Grid item md={6}>
          <Typography
            sx={{
              fontSize: "220%",
              color: "primary",
              padding: "20px",
              fontFamily: "Young Serif",
              color: "#2196F3",
            }}
          >
            GST 3B - SALES
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          height: 300,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
          "& .super-app-theme--header": {
            backgroundColor: "#676767",
            color: "white",
            fontSize: "17px",
            border: "1px solid #fff",
            borderRadius: "5px",
          },
        }}
      >
        {console.log(rows, calculateTotals())}
        <DataGrid
          rows={[...rows]}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
      <TextField
        label="Total amount of GST"
        variant="outlined"
        value={
          rows != []
            ? ((rows[0] && rows[0].total) - (rows[1] && rows[1].total)).toFixed(
              2
            )
            : ""
        }
        style={{ marginTop: "20px" }}
      />
      <br />
      <TextField
        label="ITC"
        variant="outlined"
        value={itc}
        onChange={handleITCChange}
        style={{ marginTop: "20px" }}
      />
      <br />
      <TextField
        label="Net Pay"
        variant="outlined"
        value={
          rows != []
            ? ((rows[0] && rows[0].total) - (rows[1] && rows[1].total)).toFixed(2) - itc
            : ""
        }
        disabled
        style={textFieldStyle}
      />
    </>
  );
}