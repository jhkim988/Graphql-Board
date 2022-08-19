import { gql } from "@apollo/client"

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
export const CREATE_PHOTO = gql`
  mutation createPhoto($file: Upload!) {
    createPhoto(file: $file) {
      title
      mimetype
      encoding
    }
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
export const ALL_POSTS = gql`
  query allPosts($page: Int, $Limit: Int) {
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
export const DELETE_COMMENT = gql`
  mutation($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`
export const GET_POST = gql`
  query getPost($postId: ID!) {
    post(postId: $postId) {
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
export const UPDATE_POST = gql`
  mutation updatePost($postId: ID!, $postInfo: postInfo!) {
    updatePost(postId: $postId, postInfo: $postInfo)
  }
`
export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`