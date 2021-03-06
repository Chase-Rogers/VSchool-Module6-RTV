import React, { useContext } from 'react'
import { IssueContext } from '../context/IssueProvider'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { UserContext } from '../context/UserProvider'
import {Icon} from 'semantic-ui-react'
import LikeButton from './LikeButton'



export default function Issue(props){
  // console.log(props)
  const {issue} = props
  const {handleDelete} = useContext(IssueContext)

  const { user } = useContext(UserContext)

  return (
    <div className="issue">
      {user._id === issue.user && (<button onClick={() => handleDelete(issue._id)}><Icon name='trash'/></button>)}
      {/* <button>Vote Up </button>{issue.votes}<button>Vote Down</button> */}
      <h1>{ issue.title }</h1>
      <img src={issue.imgUrl} alt="issue image" width={300}/>
      <h3>{ issue.description }</h3>
      <LikeButton issue={issue}></LikeButton>
      <CommentList issueId={issue._id} comments={issue.comments} ></CommentList>
      <CommentForm issueId={issue._id}></CommentForm>
    </div>
  )
}