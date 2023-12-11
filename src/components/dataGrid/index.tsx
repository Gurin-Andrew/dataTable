import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridSortItem } from '@mui/x-data-grid';
import { Paper, Typography, Button,  Modal } from '@mui/material';
import axios from 'axios';
import './style.scss'
import ImageModal from '../ImageModal';


interface Book {
  id: string;
  thumbnail: string;
  title: string;
  authors: string;
  publishedDate: string;
}
interface BookAxiosResponse{
    id: string
    volumeInfo:{
        imageLinks?:{
            thumbnail:string
        };
        title?: string;
        authors?: string[];
        publishedDate?: string;
    }
}

interface DataTableProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, renderCell: (params)=>(
        <div style={{ color:"red" }}>{params.value}</div>
    )},
    { field: 'thumbnail', headerName: 'Thumbnail', width: 100,  renderCell: (params) => (
      <img
        src={params.value} 
        alt="book cover" 
        style={{ width: '100%', height: '100%',}} 
      />)},
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'authors', headerName: 'Authors', width: 200 },
    { field: 'publishedDate', headerName: 'Published Date', width: 150 },
  ];   


const DataTable: React.FC<DataTableProps> = ({ darkMode, toggleDarkMode }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading,setIsLoading]= useState(false)
  useEffect(() => {
    const storageInfo = localStorage.getItem('dataGridState')
    console.log(storageInfo)
    if (storageInfo){
        const savedState = JSON.parse(storageInfo);
        setPage(savedState.page || 1);
        setPageSize(savedState.pageSize || 5);
        setSortModel(savedState.sortModel || []);
    }
   
  }, []);

  useEffect(() => {
    const currentState = { page, pageSize, sortModel };
    localStorage.setItem('dataGridState', JSON.stringify(currentState));
  }, [page, pageSize, sortModel]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'react',
            startIndex: (page - 1) * pageSize,
          },
        });
        setBooks(response.data.items.map((book: BookAxiosResponse, index:number) => ({
          id: index +1 ,
          thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
          title: book.volumeInfo.title || '',
          authors: book.volumeInfo.authors?.join(', ') || '',
          publishedDate: book.volumeInfo.publishedDate || '',
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false)
    };

    fetchData();
  }, [page, pageSize]);


  const handleThumbnailClick = (row: { thumbnail: string }) => {
    setSelectedThumbnail(row.thumbnail);
    setImageModalOpen(true);
  };

  const handleRowClick = (data: { row: React.SetStateAction<Book | null>; }) => {
    setSelectedBook(data.row);
    setModalOpen(true);
  };

  const handleCellClick = (params: any) => {
    const clickedColumn = params.colDef.field;
    if (clickedColumn === '__check__' ) return;
    if (clickedColumn === 'thumbnail') {
      handleThumbnailClick(params.row);
    } else {
      handleRowClick(params);
    }
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };



  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getRowId = (book: Book) => book.id;

  const getRowHeight = () => {
    return Math.min(Math.max(selectedBook ? 100 : 0, 100), 300);
  };

  return (
      <div className='data-table-container'>
        <DataGrid
          loading={isLoading}
          rows={books}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick = {true}
          onPaginationModelChange={(model)=> setPage(model.page)}
          checkboxSelection
          sortingOrder={['asc', 'desc']}
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          onCellClick={handleCellClick}
          getRowId={getRowId}
          getRowHeight={getRowHeight}
        />
     <ImageModal isOpen={imageModalOpen} onRequestClose={handleCloseImageModal} imageUrl={selectedThumbnail} />   
     <Modal open={modalOpen} onClose={handleCloseModal}>
          <Paper className="modal-content">
            <Typography variant="h5">Book Information</Typography>
            {selectedBook && (
              <>
                <div>
                  <strong>Title:</strong> {selectedBook.title}
                </div>
                <div>
                  <strong>Authors:</strong> {selectedBook.authors}
                </div>
                <div>
                  <strong>Published Date:</strong> {selectedBook.publishedDate}
                </div>
              </>
            )}
            <Button variant="contained" onClick={handleCloseModal} className="button-close">
              Close
            </Button>
          </Paper>
        </Modal>
      </div>
  );
};

export default DataTable;