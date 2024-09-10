import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import { TextField } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllRecordsQuery, useUpdateRecordMutation } from '../store/storeApi';
import { useGlobalContext } from '../context/GlobalStateProvider';
import { FileUpload } from './FileUpload';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

function UpdateModal({id}) {
	const [open, setOpen] = React.useState(false);
	const {data, refetch} = useGetAllRecordsQuery();
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const [updateRecord, { isLoading, isError, error, isSuccess, success }] = useUpdateRecordMutation();
	const [boardTitle, setBoardTitle] = React.useState('');
	const [boardDescription, setBoardDescription] = React.useState('');
	const [loading, setLoading] = React.useState(false);
    const {setUploadFile} = useGlobalContext();
    const [selectedFile, setSelectedFile] = React.useState(null);
  
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};


  const handleFileChange = (file) => {
        setSelectedFile(file);
    };
    // console.log(selectedFile, "file");
  
    const onSubmit = async () => {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append('name', userInfo?.user?.firstName)
        await updateRecord({ id, data: formData });
        setUploadFile(true)
        toast.success("File updated successfully");
        setOpen(false)
        // Navigate or show success message here
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.data.message);
        setOpen(false)
        // Handle error
      }
    };


	return (
		<React.Fragment>
			 <Tooltip title="Update">
			<Icon icon='bx:edit' onClick={handleClickOpen} className='text-[2vw] text-gray-400 p-[0.3vw] hover:bg-gray-200 rounded-full ml-[0.5vw]' />
			</Tooltip>
			<ToastContainer />
			<BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
				<DialogTitle id='customized-dialog-title'>Update Record</DialogTitle>
				<DialogContent dividers>
				<form className='flex justify-center items-center p-[2vw] w-full flex-col' onSubmit={onSubmit}>
                        <p>Do you want to update this record?  Please upload a new file here</p>
                        <figure className=" mt-[2vw] cursor-pointer" ><FileUpload handleFile={handleFileChange} /></figure>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button variant='contained' type='submit' form='updateRecord' onClick={onSubmit}>
						{loading ? 'updating...' : 'update'}
					</Button>
				</DialogActions>
			</BootstrapDialog>
		</React.Fragment>
	);
}

export default UpdateModal;