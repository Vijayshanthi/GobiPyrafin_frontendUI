import * as React from "react";
import Box from "@mui/material/Box";
import { Grid, Container } from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

export default function TdsRecord({ }) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getExpenseRecord();
  }, []);
  const getExpenseRecord = async () => {
    await axios
      .get(`http://188.166.228.50:8089/tds/getexpensetdsdetails`, {
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
          <b> TDS & Deduction </b>
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
  ];

  return (
    <Container
      maxWidth="xl"
      style={{ marginTop: "20px", height: "100vh", width: "100%" }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            color="primary"
            style={{
              fontSize: "200%",
              color: "secondary",
              padding: "10px",
              fontFamily: 'Vazir',
              color: "Black",
              fontWeight: "bold",
            }}
          >
            Tax Deducted at Source
          </Typography>
        </Grid>
      </Grid>
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
            backgroundColor: "LightGrey",
            color: "Black",
            fontSize: "17px",
            border: "1px solid #fff",
            borderRadius: "5px",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
    </Container>
  );
}