import React, { useContext, useEffect } from 'react'
import IssueForm from './IssueForm'
import IssueList from './IssueList'
import { IssueContext } from '../context/IssueProvider'

export default function Public(){
  const { 
    user: { 
      username 
    },  
    issues,
    getIssues
  } = useContext(IssueContext)

  useEffect(() => {
    getIssues()
  },[])

  return (
    <div className="profile">
      <h1>Welcome {username}!</h1>
      <h3>Issues</h3>
      <IssueList issues={issues}/>
    </div>
  )
}