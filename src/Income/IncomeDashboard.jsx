import React from "react";
import { Grid } from "@mui/material";
import Income from "./Income";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ApiCalls from "../API/ApiCalls";
import IncomeImg from "../../src/assets/Images/income.png";
import { useNavigate } from "react-router-dom";


export default function IncomeDashboard() {
  const navigate = useNavigate();
  const [totalIncome, setTotalIncome] = useState(0);
  const [unpaidIncome, setUnpaidIncome] = useState(0);

  useEffect(() => {
    totalunpaidincomecall();
  }, []);
  useEffect(() => {
    totalIncomecall();
  }, []);

  const totalunpaidincomecall = async () => {
    await ApiCalls.getUnpaidTotalIncome()
      .then((res) => {
        if (
          (res && res.status == 401) ||
          (res.response && res.response.status == 401)
        ) {
          navigate("/login");
        }

        setUnpaidIncome(res.data.Total);
      })
      .catch((err) => console.log(err));
  };
  const totalIncomecall = async () => {
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

  
  return (
    <Grid container sx={{ flexGrow: 1 }}>
      <Grid container xs={12}>
        <Grid item md={6} xs={3}>
          <Typography
            sx={{
              fontSize: "250%",
              color: "secondary",
              padding: "10px",
              fontFamily: 'Vazir',
              color: "Black",
              fontWeight: "bold",
            }}
          >
            INCOME OUTSTANDING
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs>
        <Grid item md={0.2}></Grid>
        <Grid item xl={3} md={3} xs={2}>
          <Box
            sx={{
              width: "250px",
              marginTop: "20px",
              borderRadius: "25px",
              display: { xs: "block", md: "block" },
              height: "150px",
              paddingLeft: "20px",
              background: "white",
              color: "Black",
              marginLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "10px",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "20px", xs: "1rem" }, color: "secondary",
                  padding: "10px",
                  fontFamily: 'Vazir',
                  color: "Black",
                  fontWeight: "bold",
                }}
              >
                Paid Income
              </Typography>
              <img src={IncomeImg} alt="" />
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                sx={{
                  fontSize: { md: "25px", xs: "1rem" }, color: "secondary",
                  padding: "10px",
                  fontFamily: 'Vazir',
                  color: "Black",
                  fontWeight: "bold",
                }}
              >
                ₹ {totalIncome ? `${totalIncome}` : 0}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: "25px", xs: "1rem" },
                  marginTop: "10px",
                  fontWeight: "800",
                  color: "green",
                }}
              >
                ↑
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item md={0.5}></Grid>
        <Grid item xl={3} md={3} xs={5}>
          <Box
            sx={{
              width: "250px",
              marginTop: "20px",
              borderRadius: "25px",
              display: { xs: "block", md: "block" },
              height: "150px",
              paddingLeft: "20px",
              background: "white",
              color: "Black",
              marginLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "10px",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "20px", xs: "1rem" }, color: "secondary",
                  padding: "10px",
                  fontFamily: 'Vazir',
                  color: "Black",
                  fontWeight: "bold",
                }}
              >
                Outstanding Income
              </Typography>
              <img src={IncomeImg} alt="" />
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                sx={{
                  fontSize: { md: "20px", xs: "1rem" }, color: "secondary",
                  padding: "10px",
                  fontFamily: 'Vazir',
                  color: "Black",
                  fontWeight: "bold",
                }}
              >
                ₹ {unpaidIncome ? `${unpaidIncome}` : 0}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: "25px", xs: "1rem" },
                  marginTop: "5px",
                  fontWeight: "800",
                  color: "green",
                }}
              >
                ↑
              </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>

      <Grid container xs={12}>
        <Grid item md={0.5}></Grid>
        <Grid item md={12}>
          <Income
            totalIncomecall={totalIncomecall}
            totalunpaidincomecall={totalunpaidincomecall}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
