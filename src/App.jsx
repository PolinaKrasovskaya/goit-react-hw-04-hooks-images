import { useState, useEffect } from "react";
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
  const [requestName, setRequesName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [status, setStatus] = useState(Status.IDLE);
  const [imageList, setImageList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const toggleModal = largeImageURL => {
    setShowModal(showModal => !showModal, largeImageURL ? largeImageURL : '');
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (!requestName) {
      return;
    }
    setStatus(Status.PENDING);

    imageAPI
      .fetchPictures(requestName)
      .then(({ hits }) => {
        setImageList(hits);
        setStatus(Status.RESOLVED);
      })
      .catch((error) => {
        setError(error);
        setStatus(Status.REJECTED);
      });
  }, [requestName]);

  useEffect(() => {
    imageAPI
      .fetchPictures(page)
      .then(({ hits }) => {
        setImageList((prevState) => [...prevState, ...hits]);
        setStatus(Status.RESOLVED);
      })
      .catch((error) => {
        setError(error);
        setStatus(Status.REJECTED);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className={style.app}>
      <Searchbar onSubmit={setRequesName} />
      {status === Status.IDLE && <Idle />}
      {status === Status.PENDING && <Loader />}
      {status === Status.REJECTED && <Error request={requestName} />}
      {status === Status.RESOLVED && (
        <ImageGallery openModal={toggleModal} imageList={imageList}/>
      )}
      {loading && <ButtonLoader />}
      {imageList.length > 11 
        && !loading 
        && status !== Status.PENDING 
        && <Button loadMore={handleLoadMore}/>}
      {showModal && (
        <Modal onClose={toggleModal} largeImage={largeImage} />
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
}
  
// import { Component } from "react";
// import { ToastContainer } from "react-toastify";
// import Searchbar from "./components/Searchbar/Searchbar";
// import ImageGallery from "./components/ImageGallery/ImageGallery";
// import Idle from './components/Idle/Idle';
// import Loader from './components/Loader/Loader';
// import Error from './components/Error/Error';
// import ButtonLoader from './components/ButtonLoader/ButtonLoader';
// import Button from "./components/Button/Button";
// import Modal from "./components/Modal/Modal";
// import imageAPI from "./services/image-api";
// import style from "./App.module.css";
// import "react-toastify/dist/ReactToastify.css";

// const Status = {
//   IDLE: 'idle',
//   PENDING: 'pending',
//   RESOLVED: 'resolved',
//   REJECTED: 'rejected',
// }

// export default class App extends Component {
//   state = {
//     requestName: '',
//     showModal: false,
//     largeImage: '',
//     status: Status.IDLE,
//     imageList: [],
//     error: null,
//     loading: false,
//     page: 1,
//   };

//   handelFormSubmit = requestName => {
//     this.setState({ requestName });
//   };

//   toggleModal = largeImageURL => {
//     this.setState(({ showModal }) => ({ 
//       showModal: !showModal,
//       largeImage: largeImageURL ? largeImageURL : '',
//     }));
//   };

//   handleLoadMore = () => {
//     this.setState({ 
//       page: this.state.page + 1,
//     });
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const prevName = prevState.requestName;
//     const nextName = this.state.requestName;
//     const { page } = this.state;

//     if (prevName !== nextName) {
//       console.log('izmenilos')

//       this.setState({ status: Status.PENDING })

//       imageAPI
//         .fetchPictures(nextName)
//         .then(imageList =>
//           this.setState({
//             imageList: imageList.hits,
//             status: imageList.hits.length !== 0 ? Status.RESOLVED : Status.REJECTED,
//           })
//         )
//         .catch(error => this.setState({ error, status: Status.REJECTED }))
//     } 
//       else if (prevState.page < page ) {

//       this.setState({ loading: true });

//       imageAPI
//         .fetchPictures(nextName, page)
//         .then(imageList =>
//           this.setState({
//             imageList: [...prevState.imageList, ...imageList.hits],
//             status: imageList.hits.length !== 0 ? Status.RESOLVED : Status.REJECTED,
//           })
//         )
//         .catch(error => this.setState({ error, status: Status.REJECTED }))
//         .finally(() => this.setState({ loading: false }));
//     }
//   }

//   render() {
//     const { requestName, status, showModal, largeImage, loading, imageList } = this.state;

//     return (
//       <div className={style.app}>
//         <Searchbar onSubmit={this.handelFormSubmit} />
//         {status === Status.IDLE && <Idle />}
//         {status === Status.PENDING && <Loader />}
//         {status === Status.REJECTED && <Error request={requestName} />}
//         {status === Status.RESOLVED && (
//           <ImageGallery openModal={this.toggleModal} imageList={imageList}/>
//         )}
//         {loading && <ButtonLoader />}
//         {imageList.length > 11 && !loading && status !== Status.PENDING && <Button loadMore={this.handleLoadMore} />}
//         {showModal && (
//           <Modal onClose={this.toggleModal} largeImage={largeImage} />
//         )}
//         <ToastContainer autoClose={3000} />
//       </div>
//     );
//   }
// }
