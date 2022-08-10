import { Fragment } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

const ALL_POSTS = gql`
  query allPosts {
    title
    postedBy {
      name
    }
    created
    # view
    good
  }
`

const PostList = () => {
  const { loading, error, data } = useQuery(ALL_POSTS);
  if (loading) return <p>loading...</p>
  if (error) return <p>ERROR: {error.message}</p>
  
  return (
    data.allPosts.map(post => {
      return (
        <Fragment>
          <th>{post.title}</th>
          <th>{post.postedBy.name}</th>
          <th>{post.created}</th>
          <th>{post.view}</th>
          <th>{post.totalComments}</th>
          <th>{post.good}</th>
        </Fragment>
        )
    })
  )
}

const Main = () => (
  <Fragment>
    <div class='col-md-12'>
      <div class='row'>
        <div class='col-md-6'>
          <a href='' role='button' class='btn btn-primary'>글 등록</a>
        </div>
      </div>
      <table class='table table-horizontal table-bordered'>
        <thead class='thead-strong'>
          <tr>
            <th class='col-md-6'>제목</th>
            <th class='col-md-2'>작성자</th>
            <th class='col-md-2'>최종수정일</th>
            <th class='col-md-1'>조회수</th>
            <th class='col-md-1'>추천</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          <PostList />
        </tbody>
      </table>
    </div>
  </Fragment>
);

export default Main;