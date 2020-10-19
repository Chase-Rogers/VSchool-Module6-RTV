import React from 'react'
import Comment from './Comment'



export default function CommentList(props){
// console.log('issue comments',props.comments)
const {comments} = props

  return (
    <div className="comment-list">
      { (comments) ? comments.map(obj => (<Comment comment={obj} issueId={obj.issueId} key={obj._id}>{obj.comment}</Comment>)) : console.log("fail") }
    </div>
  )
}