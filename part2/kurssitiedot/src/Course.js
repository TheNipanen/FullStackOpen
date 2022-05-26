const Header = (props) => (
  <h2>{props.name}</h2>
)
const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)
const Content = (props) => (
  <>
    {props.parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
)
const Total = (props) => (
  <p>
    <strong>total of {props.parts.reduce((prev, curr) => prev + curr.exercises, 0)} exercises</strong>
  </p>
)
const Course = ({course}) => (
  <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
)

export default Course