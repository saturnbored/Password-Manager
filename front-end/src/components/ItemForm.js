import {
  Card,
  TextField,
  Grid,
  CardContent,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

import "./components.css";

const ItemForm = (props) => {
  const [nameValue, setNameValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [urlValue, setURLValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState(" ");

  if (props.data) {
    if (props.data.name) setNameValue(props.data.name);
    if (props.data.username) setUsernameValue(props.data.username);
    if (props.data.password) setPasswordValue(props.data.password);
    if (props.data.url) setURLValue(props.data.url);
    if (props.data.description) setDescriptionValue(props.data.description);
  }

  console.log(props);

  const [isUpdated, setIsUpdated] = useState(false);

    // useEffect(function(){
    //   console.assert.log('The form was closed');
    // }, [showForm]);
 
  const handleSubmit = function () {
    console.log("submit button clicked");
  };
  const handleUpdate = function () {
    console.log("update button clicked");
  };
  return (
    <>
      <Card className="item-form" elevation={0}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                placeholder="Enter a name for this entry"
                required
                fullWidth
                value={nameValue}
                onChange={(e) => {
                  setNameValue(e.target.value);
                  setIsUpdated(true);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                placeholder="Enter the username here"
                fullWidth
                value={usernameValue}
                onChange={(e) => {
                  setUsernameValue(e.target.value);
                  setIsUpdated(true);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="password"
                label="Password"
                placeholder="Enter the password here"
                fullWidth
                value={passwordValue}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                  setIsUpdated(true);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="url"
                label="URL"
                placeholder="Enter the URL"
                fullWidth
                value={urlValue}
                onChange={(e) => {
                  setURLValue(e.target.value);
                  setIsUpdated(true);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                placeholder="Description"
                fullWidth
                multiline
                rows={4}
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                  setIsUpdated(true);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {props.isNewItem ? (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ) : isUpdated ? (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  onClick={handleUpdate}
                >
                  Save Changes
                </Button>
              ) : (
                <Button variant="contained" fullWidth disabled>
                  Save Changes
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ItemForm;
