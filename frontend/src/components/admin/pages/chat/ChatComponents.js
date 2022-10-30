import React, {useEffect, useState} from "react";
import socket from "./appContext";

import AdminHeaderComponents from "../../layouts/AdminHeaderComponents";
import AdminAsideComponents from "../../layouts/AdminAsideComponents";
import AdminFooterComponents from "../../layouts/AdminFooterComponents";
import "./style.css";
import api from "../../../../config/api";

function ChatComponents() {
    const [users, setUsers] = useState([]);
    const [findUser, setFindUser] = useState({});
    const [chatBox, setChatBox] = useState(false);
    const [message, setMessage] = useState([]);

    /*
    ==================Chat Box Default False================
     */


    const getMessageBySenderAndReceiver = async (senderId, receiverId) => {
        let sendData = {
            senderId: senderId,
            receiverId: receiverId
        }
        let data = await api.post('/message/', sendData);
        setMessage(data.data);
    }

    const clickUserList = async (userId) => {
        setChatBox(true);
        getUserByClick(userId);
        let senderId = localStorage.getItem("userId");
        await getMessageBySenderAndReceiver(senderId, userId);
    }

    const closeChatBox = () => {
        setChatBox(false);
    }

    /*
    ====================Send Message===================
     */


    const sendMessage = (e) => {
        let message = e.target.value;
        let senderId = localStorage.getItem("userId");
        let receiverId = findUser._id;

        if (e.keyCode === 13) {
            socket.emit("message", {
                message: message,
                sender: senderId,
                receiver: receiverId,
            });
            e.target.value = "";
        }
    }


    /*
  ====================End Send Message===================
   */


    /*
  =============Get all users===============
  */

    const getUserByClick = (id) => {
        api.get(`/users/${id}`).then((response) => {
            setFindUser(response.data.users);
        }).then((error) => {
            console.log(error);
        }, []);
    }


    useEffect(() => {
        api.get('/users').then((response) => {
            setUsers(response.data.users);
        }).then((error) => {
            console.log(error);
        });
    }, []);


    socket.on('message', async (msg) => {
        let senderId = localStorage.getItem("userId");
        let receiverId = findUser._id;
        setMessage([...message, msg]);
        // await getMessageBySenderAndReceiver(senderId, receiverId);

    });

    return (
        <div>
            <AdminHeaderComponents/>
            <AdminAsideComponents/>
            <main id="main" className="main">
                <section className="section">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="chat-title">
                                        <h2><i className="bi bi-messenger"></i> Chat Dashboard</h2>
                                    </div>
                                </div>
                                <div className="col-md-12 mt-5">
                                    <div className="row">
                                        {chatBox ? (
                                            <div className="chat-main-box col-md-8">
                                                <div className="col-md-12">
                                                    <button onClick={() => closeChatBox()}
                                                            className="btn btn-danger justify-content float-end">Close
                                                    </button>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="chat-box-header">
                                                            <img src={findUser.image} alt=""/>

                                                            <h1> {findUser.name ? findUser.name : "No Name"}</h1>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="messageListBox">
                                                            {message && message.map((msg, index) => (
                                                                <div key={index}>
                                                                    {msg.sender === localStorage.getItem("userId") ? (
                                                                            <div
                                                                                className="receivedMessageBox">
                                                                                {msg.message}
                                                                            </div>) :
                                                                        <div
                                                                            className="senderMessageBox">
                                                                            {msg.message}
                                                                        </div>
                                                                    }
                                                                </div>
                                                            ))}


                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <textarea onKeyDown={sendMessage}
                                                                      className="form-control"></textarea>
                                                        </div>


                                                    </div>

                                                </div>
                                            </div>
                                        ) : <div className="col-md-8 no-user-select">
                                            <h1>Conversations with Friends <i className="bi bi-people-fill"></i></h1>

                                            <h1><i className="bi bi-arrow-right-circle-fill"></i></h1>

                                        </div>}

                                        <div className="col-md-4 userBoxList">
                                            <div className="user-list-section">
                                                <h3>Users</h3>
                                                <ul className="user-list">
                                                    {users.map((user) => (
                                                        <div key={user._id}>
                                                            {
                                                                (() => {
                                                                    if (user._id !== localStorage.getItem("userId"))
                                                                        return <li
                                                                            onClick={() => clickUserList(user._id)}>
                                                                            <div className="user-list-item">
                                                                                <div className="user-list-item-image">
                                                                                    <img src={user.image} width="40"
                                                                                         alt=""/>
                                                                                </div>
                                                                                <div className="user-list-item-name">
                                                                                    <h4>
                                                                                        {user.name}
                                                                                    </h4>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    else
                                                                        return <span></span>
                                                                })()
                                                            }

                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <AdminFooterComponents/>
        </div>
    )


}

export default ChatComponents;