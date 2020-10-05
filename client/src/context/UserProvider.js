import React, { useState } from 'react'
import axios from 'axios'

export const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export default function UserProvider(props){

  const initInputs = {
    title: "",
    description: "",
    imgUrl: "",
    votes: 0,
    comments: []
  }

  const commentsInput = {
    comment: '',
    issue: ''
  }

  const [comments, setComments] = useState(commentsInput)
  const [inputs, setInputs] = useState(initInputs)

  const initState = { 
    user: JSON.parse(localStorage.getItem("user")) || {}, 
    token: localStorage.getItem("token") || "", 
    issues: [],
    issueComments: [],
    errMsg: ''
  }

  const [userState, setUserState] = useState(initState)



  function signup(credentials){
    axios.post("/auth/signup", credentials)
      .then(res => {
        const { user, token } = res.data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        setUserState(prevUserState => ({
          ...prevUserState,
          user,
          token
        }))
      })
      .catch(err => handleAuthErr(err.response.data.errMsg))
  }

  function login(credentials){
    axios.post("/auth/login", credentials)
      .then(res => {
        const { user, token } = res.data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        getUserIssues()
        setUserState(prevUserState => ({
          ...prevUserState,
          user,
          token
        }))
      })
      .catch(err => handleAuthErr(err.response.data.errMsg))
  }

  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUserState({
      user: {},
      token: "",
      issues: []
    })
  }

  function handleAuthErr(errMsg) {
    setUserState(prevState => ({
      ...prevState,
      errMsg
    }))
  }

  function resetAuthErr() {
    setUserState(prevState => ({
      ...prevState,
      errMsg: ``
    }))
  }

  function getUserIssues(){
    userAxios.get("/api/issue/user")
      .then(res => {
        const i = res.data.map(issue => {
          issue.comments = getIssueComments(issue._id).then(o => {
            console.log('This is my O ',o)
            issue.comments = o;
            return o
          })
          return issue;
        });

        console.log('Issue with Comments', i)
        setUserState(prevState => ({
          ...prevState,
          issues: i
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }

  function getIssueComments(userId){
    const userData = userAxios.get(`/api/comment/${userId}`)
      .then(res => {
        // console.log(res.data)
        setUserState(prevState => ({
          ...prevState,
          issueComments: res.data
        }))
        return res.data
      })
      .catch(err => console.log(err.response.data.errMsg))
      return userData
  }

  function addComment(){
    console.log(comments)
    userAxios.post('/api/comment',comments)
      .then(res => {
        setComments(prevState => ({
          ...prevState,
          comments: res.data
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }
  function addIssue(newIssue){
    userAxios.post("/api/issue", newIssue)
      .then(res => {
        setUserState(prevState => ({
          ...prevState,
          issues: [...prevState.issues, res.data]
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }

  const handleDelete = (issueId) => {
    axios
        .delete(`/${issueId}`)
        .then((res) => {
            return setUserState(prevInputs => ({
                ...prevInputs,
                issues: [...prevInputs.issues.filter(issue => issue._id !== issueId)]
            }));
        })
        .catch((err) => console.log(err.response.data.errMsg));
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        signup,
        login,
        logout,
        addIssue,
        addComment,
        resetAuthErr,
        handleDelete,
        setInputs,
        inputs,
        initInputs,
        comments,
        setComments
      }}>
      { props.children }
    </UserContext.Provider>
  )
}