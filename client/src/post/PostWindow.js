import { Stack } from "@mui/system";
import { TableContainer, TableRow, TableCell } from "@mui/material";

const PostWindow = ({ post }) => {
  return (
    <TableContainer>
      <TableRow>
        <TableCell>제목: {post.title}</TableCell>
      </TableRow>
      {
      post.photo &&
        <TableRow>
          <img src={`http://localhost:4000/img/photos/${post.photo}`} alt=''/>
        </TableRow>
      }
      <TableRow>
      <TableCell style={{ 'whiteSpace': 'pre-wrap' }}>{post.content}</TableCell>
      </TableRow>
    </TableContainer>
  )
}

export default PostWindow;