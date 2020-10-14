import React, { useContext, useEffect } from 'react'
import IssueForm from './IssueForm'
import IssueList from './IssueList'
import { IssueContext } from '../context/IssueProvider'

export default function Profile(){
  const { 
    user: { 
      username 
    }, 
    addIssue, 
    issues,
    getUserIssues
  } = useContext(IssueContext)

  useEffect(() => {
    getUserIssues()
  },[])

  return (
    <div className="profile">
      <h1>Welcome {username}!</h1>
      <h3>Add A Issue</h3>
      <IssueForm addIssue={addIssue}/>
      <h3>Your Issues</h3>
      <IssueList issues={issues}/>
    </div>
  )
}