import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';
import Footer from './components/footer';

function App() {

  const [images, setImages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const API_URL = 'http://localhost:5000/photos';

  const getImages = () => {
    axios.get(API_URL).then(res => {
      setImages(res.data.resources)
      setNextCursor(res.data.next_cursor ? res.data.next_cursor : null);
      // if (res.data.next_cursor) { setNextCursor(res.data.next_cursor) }
    }).catch(err => console.log(err));
  }

  useEffect(() => {
    getImages();
  }, [])


  const loadMoreHandler = () => {
    const params = new URLSearchParams();

    if (nextCursor) {
      params.append('next_cursor', nextCursor);
    }
    axios.get(`${API_URL}?${params}`).then(res => {
      setImages((pre) => [...pre, ...res.data.resources]);
      setNextCursor(res.data.next_cursor ? res.data.next_cursor : null);
      // if (res.data.next_cursor) { setNextCursor(res.data.next_cursor) }
    }).catch(err => console.log(err));
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (inputValue) {
      params.append('expression', inputValue);
    }
    axios.get(`http://localhost:5000/search?${params}`).then(res => {
      setImages(res.data.resources);
      setNextCursor(res.data.next_cursor ? res.data.next_cursor : null);
    })
  }

  const formClearHandler = () => {
    getImages();
    setInputValue("")
  }

  const fileuploadHandler = (e) => {
    const P_KEY='j9exp8wj'
    const CLOUD_NAME = 'dx5gkslex'

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file',file);
    formData.append('upload_preset',P_KEY);

    axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,formData).then(res=>{
      window.location.reload();
    }).catch(err=>console.log(err ))
  }

  return (
    <div>

      <form onSubmit={formSubmitHandler}>
        <input className='input' type='text' placeholder='Enter a search value' value={inputValue} onChange={e => setInputValue(e.target.value)} />
        <button type='submit'>Search</button>
        <button type='button' onClick={formClearHandler}>Clear</button>
        <input type='file' onChange={fileuploadHandler} />
      </form>

      <div className="images">
        {images.map(el => <img src={el.url} key={images.indexOf(el)} />)}
      </div>

      <Footer loadMoreHandler={loadMoreHandler} nextCursor={nextCursor} />
    </div>
  );
}

export default App;
