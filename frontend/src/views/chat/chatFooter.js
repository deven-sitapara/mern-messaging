import { Send } from "@mui/icons-material";
import { Fab, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React from "react";
import { useState } from "react";
import { useRef } from "react";

// ==============================|| CHAT Footer PAGE ||============================== //

const ChatFooter = ({socket,handleSubmit}) => {
  return (
          <Grid container style={{ paddingTop: "10px" }}>
            <Formik
              initialValues={{ chatMessage: '' }}
              onSubmit={handleSubmit}
             >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                initialValues
              }) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  style={{ display: "inline-flex", width: "100%" }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container>
                      <Grid item xs={11} sx={{ paddingRight: "10px" }}>
                        <TextField
                          onChange={handleChange}
                          id="chatMessage"
                          name="chatMessage"
                          label="Type Something here..."
                          fullWidth
                          value={values.chatMessage}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Fab type="submit" color="primary" aria-label="add">
                          <Send />
                        </Fab>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
  );
};

export default ChatFooter;
