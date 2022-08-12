const PostUpdateWindow = ({ setPostInfo, setIsUpdateWindow, updatePost }) => {
  const updateDone = () => {
    // TODO:
    let postInfo; // Form Data
    updatePost(postInfo);
    setIsUpdateWindow(false);
  }
  const updateCancle = () => {
    setIsUpdateWindow(false);
  }
  return (
    <form>
      <input type='text'/>
      <img type='file' accept='image/jpeg, image/png' alt=''/>
      <input type='textarea'></input>
      <button onClick={updateDone}>수정완료</button>
      <button obClick={updateCancle}>취소</button>
    </form>
  )
}

export default PostUpdateWindow;