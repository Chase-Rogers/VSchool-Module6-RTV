import React, {useContext} from 'react'
import Comment from './Comment'
import { UserContext } from '../context/UserProvider.js'



export default function CommentList(){
const {issueComments} = useContext(UserContext)
console.log('issue comments',issueComments)


  return (
    <div className="comment-list">
        {/* {(issueComments) ? console.log(true) : console.log(false)} */}
      { (issueComments) ? issueComments.map(obj => (<Comment issueComment={obj} issueId={obj.issueId} key={obj._id}>{obj.comment}</Comment>)) : console.log("fail") }
      <p>test</p>
    </div>
  )
}