import React, { useContext } from 'react'
import { UserContext } from '../context/UserProvider.js'
import CommentForm from './CommentForm'
import CommentList from './CommentList'



export default function Issue(props){
  const { title, description, imgUrl, votes, _id } = props
  const {handleDelete} = useContext(UserContext)

  
  // const { user: {username}, comments} = useContext(UserContext)

  

  return (
    <div className="issue">
      <button onClick={() => handleDelete(_id)}>Delete</button>
      <h1>{ title }</h1>
      <h3>{ description }</h3>
      <img src={imgUrl} alt="issue image" width={300}/>
      <button>Vote Up </button>{votes}<button>Vote Down</button>
      <CommentList issueId={_id} ></CommentList>
      <CommentForm issueId={_id}></CommentForm>
    </div>
  )
}