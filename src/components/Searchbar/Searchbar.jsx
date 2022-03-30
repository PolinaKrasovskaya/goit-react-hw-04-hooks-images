import { useState } from "react";
import { toast } from "react-toastify";
import style from './Searchbar.module.css';
import propTypes from 'prop-types';

export default function Searchbar({ onSubmit }) {
  const [request, setRequest] = useState('');

  const handleNameChange = event => {
    setRequest(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (request.trim() === '') {
      return toast("Введите запрос!", { 
        icon: "🦄",
        backgroundColor: "aqua",
      });
    }
    onSubmit(request);
    setRequest('');
  };

  return (
    <header className={style.searchbar}>
      <form onSubmit={handleSubmit} className={style.form}>
        <button type="submit" className={style.button}>
          <span className={style.buttonLabel}>Search</span>
        </button>
        <input
          className={style.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          
          
          onChange={handleNameChange}
          value={request}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: propTypes.func.isRequired,
};


// import { Component } from "react";
// import { toast } from "react-toastify";
// import style from './Searchbar.module.css';
// import propTypes from 'prop-types';

// export default class Searchbar extends Component {
//   state = {
//     request: '',
//   };

//   handleNameChange = event => {
//     this.setState({ request: event.currentTarget.value.toLowerCase() });
//   };

//   handleSubmit = event => {
//     event.preventDefault();

//     if (this.state.request.trim() === '') {
//       return toast("Введите запрос!", { 
//         icon: "🦄",
//         backgroundColor: "aqua",
//       });
//     }
//     this.props.onSubmit(this.state.request);
//     this.setState({ request: '' });
//   };

//   render() {
//     return (
//       <header className={style.searchbar}>
//         <form onSubmit={this.handleSubmit} className={style.form}>
//           <button type="submit" className={style.button}>
//             <span className={style.buttonLabel}>Search</span>
//           </button>
//           <input
//             className={style.input}
//             type="text"
//             autoComplete="off"
//             autoFocus
//             placeholder="Search images and photos"
//             value={this.state.request}
//             onChange={this.handleNameChange}
//           />
//         </form>
//       </header>
//     );
//   }
// }

// Searchbar.propTypes = {
//   onSubmit: propTypes.func.isRequired,
// };