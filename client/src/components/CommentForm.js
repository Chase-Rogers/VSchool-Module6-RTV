import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserProvider.js'


export default function Comment(props){
    const {  issueId } = props
    const {comments, setComments, addComment} = useContext(UserContext)
    console.log(issueId)
    // let {comment} = comments
const [comment, setComment] = useState('')

const { 
    user: { 
      username 
    }
  } = useContext(UserContext)

function handleChange(e){
    const {name, value} = e.target
    setComments(prevInputs => ({
        ...prevInputs,
      [name]: value,
      commenter: username,
      issue: issueId
    }))
    setComment(value)
  }

  function handleSubmit(e){
    e.preventDefault()
    addComment(comment)
    setComment('')
}
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text" 
        name="comment" 
        value={comment} 
        onChange={handleChange} 
        placeholder="Comment"/>
      <button>Comment</button>
    </form>
  )
}