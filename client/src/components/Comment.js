import React, { useContext } from 'react'
// import comment from '../../../models/comment.js'
import { IssueContext } from '../context/IssueProvider'





export default function Comment(props){

    // const {issueComments} = useContext(IssueContext)
    const { comment } = props
    // const {issueComment} = props
  console.log('here',comment)

  return (
    <div className="Comment">
        <p>{comment.comment}</p>
    </div>
  )
}