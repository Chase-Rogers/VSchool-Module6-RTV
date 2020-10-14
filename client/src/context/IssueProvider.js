import React, { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserProvider.js'

export const IssueContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  config.headers.Authorization = `Bearer ${token}`
//   console.log(config.headers)
  return config
})

export default function IssueProvider(props){

  const initInputs = {
    title: "",
    description: "",
    imgUrl: "",
    votes: 0,
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
//   console.log(initState)

  const [userState, setUserState] = useState(initState)


  function getUserIssues(){
    userAxios.get("/api/issue/user")
      .then(res => {
        Promise.all(res.data.map(async issue => {
          return {
            ...issue,
            comments: await getIssueComments(issue._id).then(o => {
              issue.comments = o;
              return o
            })
          }
        }))
        .then(res => {
            console.log('Issue with Comments', res)
            setUserState(prevState => ({
              ...prevState,
              issues: res
            }))
        })

      })
      .catch(err => console.log(err.response.data.errMsg))
  }

  function getIssues(){
    userAxios.get("/api/issue")
      .then(res => {
        Promise.all(res.data.map(async issue => {
          return {
            ...issue,
            comments: await getIssueComments(issue._id).then(o => {
              issue.comments = o;
              return o
            })
          }
        }))
        .then(res => {
            console.log('Issue with Comments', res)
            setUserState(prevState => ({
              ...prevState,
              issues: res
            }))
        })

      })
      .catch(err => console.log(err.response.data.errMsg))
  }

  function getIssueComments(userId){
    const userData = userAxios.get(`/api/comment/${userId}`)
      .then(res => {
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
        // setComments(prevState => ({
        //   ...prevState,
        //   comments: res.data
        // }))
        setUserState(prevState => ({
          ...prevState,
          issueComments: [...prevState.issueComments, res.data]
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
    userAxios.delete(`/api/issue/${issueId}`)
        .then((res) => {
            console.log(res)
            return setUserState(prevInputs => ({
                ...prevInputs,
                issues: [...prevInputs.issues.filter(issue => issue._id !== issueId)]
            }));
        })
        .catch((err) => console.log(err.response.data.errMsg));
  };

  return (
    <IssueContext.Provider
      value={{
        ...userState,
        addIssue,
        addComment,
        handleDelete,
        setInputs,
        inputs,
        initInputs,
        comments,
        setComments,
        getUserIssues,
        getIssues
      }}>
      { props.children }
    </IssueContext.Provider>
  )
}