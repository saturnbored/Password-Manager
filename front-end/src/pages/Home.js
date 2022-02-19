import Navbar from "../components/Navbar";
import { Grid } from "@mui/material";

import ItemCard from "../components/ItemCard";
import AddItemButton from "../components/AddItemButton";
import DownloadVaultButton from "../components/DownloadVaultButton";

const Home = () => {
  return (
    <>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={12} container spacing ={10} style = {{
          paddingLeft: 100,
          paddingTop: 120
        }}>
          <Grid item xs = {3}>
            <DownloadVaultButton/>
          </Grid>
          <Grid item xs={6}>
            <div className="vault">
              <ItemCard />
              <ItemCard />
            </div>
          </Grid>
          <Grid item xs = {2}>
            <AddItemButton/>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
