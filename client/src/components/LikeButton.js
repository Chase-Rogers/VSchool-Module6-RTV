import React, {useContext, useState} from 'react'
import { UserContext } from '../context/UserProvider'
import { IssueContext } from '../context/IssueProvider'
import {Icon, Button, Label} from 'semantic-ui-react'






export default function LikeButton(props){
    
    const { 
        user: { 
            username 
        }, 
        issues,
        getUserIssues,
        issueLiked
    } = useContext(IssueContext)
    
    const [liked, setLiked] = useState(props.issue.voters.includes(username))

    // useEffect(() => {
    //     if(user && likes.find(like => like.username === user.username)) {
    //         setLiked(true)
    //     } else setLiked(false)
    // }, [user, likes])

    const likeButton = liked ? (
            <Button color='teal'>
                <Icon name='heart' color='red'/>
            </Button>
        ) : (
            <Button color='teal'>
                <Icon name='heart' color='grey' />
            </Button>
        )

        // console.log(props.issue._id)
    const likeIssue = () => {
        issueLiked(props.issue._id, username, props.issue)
        console.log(liked)
        setLiked((toggle) => !toggle)
        
    }

    return (
        <div>
            {liked ? (
                <Button as='div' onClick={() => likeIssue(props.issue._id, username, props.issue)} color='teal'>

                        <Icon name='heart' color='red'/>
                        {props.issue.voters.length}

                    {/* <Label basic color = 'teal' pointing='left'> */}
                    {/* {likeCount} */}
                    {/* </Label> */}
                </Button>
            ) : (
                <Button as='div' onClick={() => likeIssue(props.issue._id, username, props.issue)} color='teal'>

                        <Icon name='heart' color='grey' />
                        {props.issue.voters.length}

                {/* <Label basic color = 'teal' pointing='left'> */}
                {/* {likeCount} */}
                {/* </Label> */}
            </Button>
            )}
        </div>
    )
}