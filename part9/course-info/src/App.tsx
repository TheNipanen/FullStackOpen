type HeaderProps = {
  courseName: string
}
const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>
}

/**
 * Helper function for exhaustive type checking
 */
 const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartWithDescription {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CoursePartWithDescription {
  type: "special";
  requirements: string[];
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

type PartProps = {
  part: CoursePart
}
const Part = (props: PartProps) => {
  switch (props.part.type) {
    case "normal":
      return (
        <p>
          <span>{props.part.name} {props.part.exerciseCount}</span>
          <br/>
          <span>{props.part.description}</span>
        </p>
      )
    case "submission":
      return (
        <p>
          <span>{props.part.name} {props.part.exerciseCount}</span>
          <br/>
          <span>{props.part.description}</span>
          <br/>
          <span>submit to {props.part.exerciseSubmissionLink}</span>
        </p>
      )
    case "groupProject":
      return (
        <p>
          <span>{props.part.name} {props.part.exerciseCount}</span>
          <br/>
          <span>project exercises {props.part.groupProjectCount}</span>
        </p>
      )
    case "special":
      return (
        <p>
          <span>{props.part.name} {props.part.exerciseCount}</span>
          <br/>
          <span>{props.part.description}</span>
          <br/>
          <span>required skills: {props.part.requirements.join(", ")}</span>
        </p>
      )
    default:
      return assertNever(props.part)
  }
}

type ContentProps = {
  courseParts: CoursePart[]
}
const Content = (props: ContentProps) => {
  return (
    <>
      {props.courseParts.map((part, i) => <Part key={i} part={part} />)}
    </>
  )
}

const Total = (props: ContentProps) => {
  return (
    <>
      <p>
        Number of exercises{" "}
        {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </>
  )
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the easy course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the hard course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;