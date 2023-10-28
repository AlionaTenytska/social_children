import DatePicker from "./DatePicker";
import { Box, Button,TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as React from 'react';

const schema = yup
  .object({
    fromDate: yup
      .date()
      .required()
      .typeError("Please select a valid date")
      .nullable()
  })
  .required();

  const initialFormData = Object.freeze({  
    dateRecording: null,
  });
  
  const today = new Date();
  let month = today.getMonth();
  console.log(month)
  


export const Example = () => {

    const [formData, setFormData] = React.useState(initialFormData);

    const handleChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, hasChanged: true, [name]: value });
      };
    
    // function hCange  (e)  {
    //     // setFormData(formData.dateRecording = e.target.value);
    //     console.log(e.target.value);
    //   };
    
    console.log(formData.dateRecording)

    const validationSchema = yup.object().shape({
        dateRecording: yup.string()
          .required("Це обов'язкове поле")
      });

      const {
        register,
        formState: { errors },
      } = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
      });

      const onSubmit = (data) => alert(JSON.stringify(data));
    
      return (
        <div className="App">
          <Box sx={{ p: 2 }}>
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
              {/* <DatePicker
                name="dateRecording"
                control={control}
                label="From Date"
                format="YYYY/MM/DD"
                error={errors?.dateRecording?.message}
                value = {formData.dateRecording}
                onChange = {(newValue) => {
                    setFormData({ ...formData, [formData.dateRecording]: newValue });
                  }}
              />
    
              <Button
                type="submit"
                variant="contained"
                sx={{ display: "block", mt: 2 }}
              >
                Submit
              </Button> */}
            {/* </form> */}

            <TextField
            type="date"
            // onFocus="(this.type='data')"
            label = "Дата"
            {...register("dateRecording")}
            placeholder=''
            InputLabelProps={{ shrink: true }}
            // defaultValue="2019-05-24"
            inputProps={{ min: today.getMonth() , max: `month`}}
            value={formData.dateRecording}
            error={errors.dateRecording ? true : false}
            helperText={errors.dateRecording?.message}
            name="dateRecording"
            onChange={handleChange}
            />

          </Box>
        </div>
      );
}