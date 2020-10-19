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
    voters: []
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
        console.log(res.data)
        setUserState(prevState => {
          console.log('prevState', prevState)
          prevState.issues.find((issue)=>issue._id === res.data.issue).comments.push(res.data);
          return ({
          ...prevState,
        })
      })
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

  Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

  const issueLiked = (issueId, username, issue) => {
    let issueToSend = Object.assign(issue)
    console.log(issueToSend)
    
    if(issueToSend.voters.includes(username)) {
      issueToSend.voters.remove(username)
      console.log('This',issueToSend)
      userAxios.put(`/api/issue/${issueId}`, issueToSend)
        .then((res) => {
          console.log(res.data)
          setUserState(prevInputs => ({
            ...prevInputs,
            [prevInputs.issues.filter(issue => issue._id === issueId).voters]: issueToSend.voters
          }))
        })
    } else {
      // console.log(false)
      console.log('One',issueToSend.voters)
      console.log(username)
      issueToSend.voters.push(username)
      console.log('Two',issueToSend)

      userAxios.put(`/api/issue/${issueId}`, issueToSend)
        .then((res) => {
          console.log(res.data)
          setUserState(prevInputs => ({
            ...prevInputs,
            [prevInputs.issues.filter(issue => issue._id === issueId).voters]: issueToSend.voters
          }))
        })
    }
  }

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
        getIssues,
        issueLiked
      }}>
      { props.children }
    </IssueContext.Provider>
  )
}