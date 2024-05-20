import * as React from 'react';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function DateRangePicker({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex w-full p-[1vw]" justifyContent="space-between" alignItems="center">
        <DatePicker className='w-full max-w-[15vw] m-[0.5vw]'
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker className='w-full max-w-[15vw]'
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DateRangePicker;
