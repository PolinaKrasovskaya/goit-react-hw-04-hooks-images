
import { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Idle from './components/Idle/Idle';
import Loader from './components/Loader/Loader';
import Error from './components/Error/Error';
import ButtonLoader from './components/ButtonLoader/ButtonLoader';
import Button from "./components/Button/Button";
import Modal from "./components/Modal/Modal";
import imageAPI from "./services/image-api";
import style from "./App.module.css";
import "react-toastify/dist/ReactToastify.css";

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

export default function App() {
  const isMounted = useRef(false);
  const isLoaded = useRef(false);
  const [requestName, setRequesName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [status, setStatus] = useState(Status.IDLE);
  const [imageList, setImageList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(1);

  useEffect(() => {
    if(!requestName) {
      return;
    }
    fetchGallery(page, requestName);
  }, [page, requestName]);

  useEffect(() => {
    if (isMounted.current) {
      setStatus(Status.PENDING)
    }
    isMounted.current = true;
  }, [requestName])

  useEffect(() => {
    // if (page === 1) {
    //   return;
    // }
    
    if (isLoaded.current) {
      setLoading(true)
    }
    isLoaded.current = true;
  }, [page])

  const fetchGallery = (page, requestName) => {

    imageAPI
    .fetchPictures(requestName, page)
    .then(response => {

      if( response.hits.length === 0 ) {
        return setStatus(Status.REJECTED);
      }

      setImageList(prevState => ([...prevState, ...response.hits]));
      setStatus(Status.RESOLVED);
      setTotalResults(response.hits.length);
      setLoading(false)
    })
    .catch(error => setError(error, Status.REJECTED))
    .finally(() => setLoading(false))
  }

  

  const handleFormSubmit = request => {
    setPage(1);
    setImageList([]);
    setTotalResults(0);
    setRequesName(request);
  }

  const onLoadMoreClick = () => {
    setPage(page => page + 1);
  };

  const toggleModal = largeImageURL => {
    setShowModal(showModal => !showModal);
    setLargeImage(largeImageURL ? largeImageURL : '')
  };

  return (
    <div className={style.app}>
      <Searchbar onSubmit={handleFormSubmit} />
      {status === Status.IDLE && <Idle />}
      {status === Status.PENDING && <Loader />}
      {status === Status.REJECTED && <Error request={requestName} />}
      {imageList.length > 0 
      && (
        <ImageGallery openModal={toggleModal} imageList={imageList}/>
      )}
      {loading && <ButtonLoader />}
      {totalResults > 0 
      && imageList.length > 11
      && status !== Status.PENDING
      && !loading
      && <Button loadMore={onLoadMoreClick} />}
      {showModal && (
        <Modal onClose={toggleModal} largeImage={largeImage} />
      )}
      <ToastContainer autoClose={1500} />
    </div>
  );
}