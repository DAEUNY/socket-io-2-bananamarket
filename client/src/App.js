import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// socket.on ('서버에서 받을 이벤트명' , function(데이터){ 
// 	// 받은 데이터 처리 
//   socket.emit('서버로 보낼 이벤트명', 데이터);
// }) 

const socket = io.connect('http://localhost:5000');

// 메시지 보내기
// socket.emit('channel', '내용이다')



// function App() {

//   const [userMsg, setUserMsg] = useState({name:'', msg:''})
//   const [chatList, setChatList] = useState([])

//   useEffect(() => {
//     socket.on("channel", ({ name, message }) => {
//       setChatList([...chatList, { name, message }]);
//     });
//   });

//   const handleTextChange = (e) => {
//     console.log(e.target.name)
//     console.log(e.target.value)
//     setUserMsg({ ...userMsg, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { name, msg } = userMsg
//     socket.emit('channel', {name, msg})
//     setUserMsg({
//       name, 
//       msg:''
//     })
//   }

//   const renderChat = () => {
//     return chatList.map(({ name, message }, index) => (
//       <div key={index}>
//         {name}:<span>{message}</span>
//       </div>
//     ));
//   };


//   return (
//     <div className="card">
//       <h1>Message</h1>
//       <div className="name-field">
//         <input
//           type='text'
//           name='name'
//           onChange = {(e) => handleTextChange(e)}
//           value = {userMsg.name || ''}
//         ></input>
//       </div>
//       <div>
//         <input
//           type='text'
//           name='msg'
//           onChange = {(e) => handleTextChange(e)}
//           value = {userMsg.msg || ''}
//         ></input>
//       </div>
//       <button 
//         onClick={handleSubmit
//       }>
//         Send Message
//       </button>
//       <div className="render-chat">
//         <h1>Chat log</h1>
//         {renderChat()} 
//       </div>
//   </div>
//   );
// }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function App() {

  socket.on('channel', (data)=> {
    console.log('내가 적은거!', data)
  })

  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("channel", ({ name, message }) => {
      setChat([...chat, { name, message }]);
      console.log(setChat)
    });
  });

  const onTextChange = (e) => {
    console.log(e.target.value);
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit("channel", { name, message });
    setState({ message: "", name });
    // setChat([...chat, { name, message }]);            // 추가
    // renderChat으로 밑에 대화내용 안 생겨서, 메시지 전송 누를 때 리스트에도 추가되게 해주고 자동으로 생성되게 함수 바로 입력해주니까 채팅로그 생김
    // 근데 메시지 보낼때가 아니라, 받을 때도 있어야 하니까 서버에서 메시지 되돌려 받았을 떄 setChat이 일어나는게 맞는데...?
  };

  // const renderChat = () => {
  //   return chat.map(({ name, message }, index) => (
  //     <div key={index}>
  //       {name}:<span>{message}</span>
  //     </div>
  //   ));
  // };

  return (
    // console.log(socket)
    <div className="card">
    <form onSubmit={onMessageSubmit}>
      <h1>Message</h1>
      <div className="name-field">
        <input
          type="text"
          name="name"
          id="outlined-multiline-static"
          onChange={(e) => onTextChange(e)}
          value={state.name || ""}
        ></input>
      </div>
      <div>
        <input
          type="text"
          name="message"
          id="outlined-multiline-static"
          onChange={(e) => onTextChange(e)}
          value={state.message || ""}
        ></input>
      </div>
      <button>Send Message</button>
    </form>
    <div className="render-chat">
      <h1>Chat log</h1>
      {/* {renderChat()} */}
      {chat.map(({ name, message }, index) => (
        <div key={index}>
          {name}:<span>{message}</span>
        </div>
        ))
      }
    </div>
  </div>
  );
}

export default App;
