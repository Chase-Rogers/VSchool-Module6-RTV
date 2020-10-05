import React, { useContext } from 'react'
// import comment from '../../../models/comment.js'
import { UserContext } from '../context/UserProvider.js'





export default function Comment(props){

    const {issueComments} = useContext(UserContext)

    const {issueComment} = props
  console.log('here',issueComment)

  return (
    <div className="Comment">
        <p>{issueComment.comment}</p>
    </div>
  )
}