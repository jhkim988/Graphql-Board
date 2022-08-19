import { Fragment } from "react"

const Score = (props) => {
  const goodClick = () => {
    props.setScore(props.good+1);
  }
  const badClick = () => {
    props.setScore(props.bad+1);
  }
  return (
    <Fragment>
      <button onClick={goodClick} className='col-md-2 btn btn-warning'>Good: {props.good}</button>
      <button onClick={badClick} className='col-md-2 btn btn-dark'>Bad: {props.bad}</button>
    </Fragment>
  )
}

export default Score;