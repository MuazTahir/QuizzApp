// import React from "react";


// // type Props = {
// //   questionnumber: number;
// //   totalQuestion: number;
// //   question: string;
// //   answers: string[];
// //   useranswer: any;
// //   callback: any;
// //   correctAnswer: string;
// //   answerSelected: boolean;
// // };
// type Props = {
//   questionnumber: number;
//   totalQuestion: number;
//   question: string;
//   answers: string[];
//   useranswer: any;
//   callback: any;
//   correctAnswer: string;
//   answerSelected: boolean;
// };

// const QuestionCards: React.FC<Props> = ({
//   questionnumber,
//   totalQuestion,
//   question,
//   answers,
//   useranswer,
//   callback,
//   correctAnswer,
//   answerSelected,
// }) => {
//   return (
//     <div>
//       <p style={{ textAlign: 'center' }}>
//         Question: {questionnumber} / {totalQuestion}
//       </p>
//       <p dangerouslySetInnerHTML={{ __html: question }}  />

//       <div className="border">
//         {answers.map((answer, index) => {
//           let buttonStyle = "";

//           if (answerSelected) {
//             if (answer === correctAnswer) {
//               buttonStyle = "green";
//             } else if (useranswer && useranswer.answer === answer) {
//               buttonStyle = "red";
//             } else {
//               buttonStyle = "gray";
//             }
//           }

//           return (
//             <div className="padding-top" key={index}>
//               <button className="border1"
//                 value={answer}
//                 onClick={callback}
//                 disabled={answerSelected}
//                 style={{ backgroundColor: buttonStyle }}
//               >
//                 <span dangerouslySetInnerHTML={{ __html: answer }} />
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default QuestionCards;

import React from "react";

type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

type Props = {
  questionnumber: number;
  totalQuestion: number;
  question: string;
  answers: string[];
  useranswer: AnswerObject | undefined;
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  correctAnswer: string;
  answerSelected: boolean;
};

const QuestionCards: React.FC<Props> = ({
  questionnumber,
  totalQuestion,
  question,
  answers,
  useranswer,
  callback,
  correctAnswer,
  answerSelected,
}) => {
  return (
    <div>
      <p style={{ textAlign: "center" }}>
        Question: {questionnumber} / {totalQuestion}
      </p>
      <p dangerouslySetInnerHTML={{ __html: question }} />

      <div className="border">
        {answers.map((answer, index) => {
          let buttonStyle = "";

          if (answerSelected) {
            if (answer === correctAnswer) {
              buttonStyle = "green";
            } else if (useranswer && useranswer.answer === answer) {
              buttonStyle = "red";
            } else {
              buttonStyle = "gray";
            }
          }

          return (
            <div className="padding-top" key={index}>
              <button
                className="border1"
                value={answer}
                onClick={callback}
                disabled={answerSelected}
                style={{ backgroundColor: buttonStyle }}
              >
                <span dangerouslySetInnerHTML={{ __html: answer }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCards;