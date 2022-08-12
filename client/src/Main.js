import { Fragment, useState } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import PostCreateWindow from './post/PostCreateWindow.js'
import PostAndComment from './post/PostAndComment.js';


const ALL_POSTS = gql`
  query allPosts {
    allPosts {
      title
      postedBy {
        name
      }
      created
      # view
      good
    } 
  }
`

const PostList = (props) => {
  return (
    props.data.allPosts.map(post => {
      return (
        <Fragment>
          <th><p onClick={post._id}>{post.title}</p></th>
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

const Main = () => {
  const { loading, error, data } = useQuery(ALL_POSTS);
  const [ viewState, setViewState ] = useState('main');
  const [ postId, setPostId ] = useState(0);
  const clickPostCreate = () => {
    setViewState('postCreate');
    document.querySelector('.modal').focus();
  }
  if (loading) return <p>loading...</p>
  if (error) return <p>ERROR: {error.message}</p>
  return (
    <Fragment>
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <button onClick={clickPostCreate} className='btn btn-primary'>글 등록</button>
          </div>
        </div>
        <table className='table table-horizontal table-bordered'>
          <thead className='thead-strong'>
            <tr>
              <th className='col-md-6'>제목</th>
              <th className='col-md-2'>작성자</th>
              <th className='col-md-1'>최종수정일</th>
              <th className='col-md-1'>조회수</th>
              <th className='col-md-1'>댓글 수</th>
              <th className='col-md-1'>추천</th>
            </tr>
          </thead>
          <tbody id='tbody'>
            <PostList data={data}/>
          </tbody>
        </table>
      </div>
      {
        viewState === 'main' ||
        (
          <Fragment>
            {
              viewState === 'postCreate'
              ? <PostCreateWindow setViewState={setViewState} />
              : <PostAndComment />
            }
          </Fragment>
        )
      }
  </Fragment>
  );
}

export default Main;