import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import Logo from './components/Logo';
import { CirclePlus, LoaderCircle, SendHorizonalIcon } from 'lucide-react';
import classNames from 'classnames';
import axios from 'axios';
import toast from 'react-hot-toast';

let messages : string[] =  [] ;

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pdfId, setPDFId] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setError('');
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        setFile(null);
        setError('Only PDF files are allowed.');
      }
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const fileUploadHandler = async () => {
    try {
      if (!file) return;

      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://mukul-aiplanet-assignment.onrender.com/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data
      setPDFId(data.id);
   
      toast.success(data.message)
    }
    catch (error) {
      toast.error('Failed to upload')
      setFile(null);
    }
    finally {
      setLoading(false);
      setText('');
    }
  }

  const generateAnswerHandler = async () => {
    console.log(pdfId);

    try {
      if (!pdfId || text==="") return;

      setLoading(true);

      const response = await axios.post('https://mukul-aiplanet-assignment.onrender.com/ask/', {
        text_id: pdfId,
        question: text
      });

      const data = response.data

      messages.push(text);
      messages.push(data.answer);
      toast.success('Answer generated')
      setText('');

    }
    catch (error) {
      toast.error('Failed to generate')
    }
    finally {
      setLoading(false);
    }
  }
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      generateAnswerHandler();
    }
  };

  return (
    <main className='h-screen flex flex-col justify-between'>
      <nav className='flex justify-between items-center p-3 h-16 shadow'>
        <Logo />

        {!file ?
          <div>
            <input
              className='block text-sm  text-slate-500 md:file:mr-4  w-52 md:w-auto file:py-2 md:file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100'
              type='file'
              accept='application/pdf'
              onChange={handleFileChange}
            />
            {!!error && <div className='  text-xs text-right text-red-600'>{error}</div>}
          </div>

          :

          pdfId ?

            <div className='text-green-400 px-4'>
              {file.name}
            </div>
            :

            loading ?

              <span className='animate-spin mx-4 '>
                <LoaderCircle color='#808080' />
              </span>

              :
              <button
                onClick={fileUploadHandler}
                className='border flex text-zinc-800 mx-4 rounded-md gap-3 px-4 py-2'
              >
                <CirclePlus />
                Upload PDF
              </button>
        }
      </nav>

      <div className='h-full border rounded-md p-5 overflow-y-scroll'>
        {
          messages.map((message,index) => {
            return (
              <div key={index} className={classNames(' my-8 rounded w-6/7 justify-between items-center p-3')}>
                <div className=' text-slate-600'>
                 <span className='flex gap-4'>
                 {index%2==0 ? 
                 <div className='bg-purple-400 text-zinc-900 text-xl font-semibold rounded-full h-10 w-10 p-3 flex items-center justify-center'> M </div> 
                 :
                 <div className='bg-green-400 text-zinc-900 text-xl font-semibold  rounded-full h-10 w-10 p-3 flex items-center justify-center'> ai </div> 
                  }
                  <p>{message}</p>
                 </span> 
                </div>
              </div>
            )
          })
        }
      </div>

      <div className={classNames('flex justify-between md:mx-28 mx-5  my-10 border-slate-300 bg-zinc-50 border h-12 p-2 rounded items-center', loading && 'opacity-50')}>

        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className='focus:outline-none w-full px-4 bg-transparent'
          placeholder='Ask Question...'
          disabled={loading}
          onKeyDown={handleKeyDown}
  
        />

        {pdfId && loading ?
          <span className='animate-spin mx-4 '>
            <LoaderCircle color='#808080' />
          </span>
          : <button onClick={generateAnswerHandler}>
            <SendHorizonalIcon color='#808080' />
          </button>}
      </div>
    </main>
  );
};

export default App;
