import { gql } from "@apollo/client"

export const ME = gql`
  query me {
    me {
      login
      loginType
      name
      avatar
    }
  }
`
export const TOTAL_POSTS = gql`
  query totalPosts {
    totalPosts
  }
`
export const ALL_POSTS = gql`
  query allPosts($page: Int, $limit: Int) {
    allPosts(page: $page, limit: $limit) {
      _id
      title
      postedBy {
        name
      }
      created
      updated
      good
    } 
  }
`
export const GET_POST = gql`
  query getPost($postId: ID!) {
    post(postId: $postId) {
      _id
      title
      content
      photo
      good
      bad
      postedBy {
        name
      }
      comments {
        _id
        commentedBy {
          name
        }
        content
        created
      }
      created
      updated
    }
  }
`
export const CREATE_POST = gql`
  mutation createPost($postInfo: PostInfo!) {
    createPost(postInfo: $postInfo) {
      _id
      title
      content
      postedBy {
        _id
        name
      }
      created
      updated
    }
  }
`
export const UPDATE_POST = gql`
  mutation updatePost($postId: ID!, $postInfo: PostInfo!) {
    updatePost(postId: $postId, postInfo: $postInfo)
  }
`
export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`
export const CREATE_PHOTO = gql`
  mutation createPhoto($file: Upload!) {
    createPhoto(file: $file) {
      title
      mimetype
      encoding
    }
  }
`
export const ADD_GOOD = gql`
  mutation addGood($postId: ID!) {
    addGood(postId: $postId)
  }
`
export const ADD_BAD = gql`
  mutation addBad($postId: ID!) {
    addBad(postId: $postId)
  }
`

export const GITHUB_LOGIN = gql`
mutation githubLogin($code: String!) {
  githubLogin(code: $code) {
    user {
      name
      login
      loginType
      avatar
    }
    token
  }
}
`
export const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      content
      created      
    }
  }
`
export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`

export const SUBSCRIPTION_COMMENT_ALARM = gql`
  subscription commentsAlarm {
    commentsAlarm
  }
`
export const SUBSCRIPTION_ADD_GOOD = gql`
  subscription addGood($postId: ID!) {
    newAddGood(postId: $postId) {
      _id
      good
    }
  }
`
export const SUBSCRIPTION_ADD_BAD = gql`
  subscription addBad($postId: ID!) {
    newAddBad(postId: $postId) {
      _id
      bad
    }
  }
`
export const SUBSCRIPTION_NEW_COMMENTS = gql`
  subscription newComments($postId: ID!) {
    newComment(postId: $postId)
  }
`