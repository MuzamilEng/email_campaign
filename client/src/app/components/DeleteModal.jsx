import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDeleteRecodByIdMutation, useGetAllRecordsQuery } from '../store/storeApi';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

function DeleteModal({id}) {
	const { data, refetch } = useGetAllRecordsQuery();
    const [deleteRecord, ] = useDeleteRecodByIdMutation();


	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	async function deleteBoard() {
		setLoading(true);
		try {
            await deleteRecord(id);
			setLoading(false);
			refetch();
			toast.success('Board deleted successfully');
			setOpen(false)
		} catch (error) {
			toast.error('Error during board deletion');
			setOpen(false)
		}
		
	}

	return (
		<>
			<Tooltip title="Delete">
			<Icon icon="mdi:delete-outline" onClick={handleClickOpen} className='text-[2vw] text-gray-400 p-[0.3vw] hover:bg-gray-200 rounded-full ml-[0.5vw]' />
			</Tooltip>
			<ToastContainer />
			<BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
				<DialogTitle id='customized-dialog-title'>Delete Board</DialogTitle>
				<DialogContent dividers>
					<Typography>Are you sure you want to delete this board?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						variant='contained'
						color={'error'}
						type='submit'
						form='createBoardForm'
						onClick={() => deleteBoard(id)}
					>
						{loading ? 'Deleting...' : 'yes'}
					</Button>
				</DialogActions>
			</BootstrapDialog>
		</>
	);
}

export default DeleteModal;
