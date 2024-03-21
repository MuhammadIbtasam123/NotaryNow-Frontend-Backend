import React, { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
} from "@mui/material";
import "./mainFiles.css";
const QuizApp = () => {
  // Sample quiz questions
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      question: "What is the largest planet in our solar system?",
      options: ["Jupiter", "Saturn", "Earth", "Mars"],
      correctAnswer: "Jupiter",
    },
    {
      id: 3,
      question: "Which of the following is a programming language?",
      options: ["Apple", "Java", "Banana", "Orange"],
      correctAnswer: "Java",
    },
  ];

  // State to store selected answers
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Function to handle checkbox change
  const handleCheckboxChange = (questionId, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedAnswers);
    // You can add logic here to check the selected answers against the correct answers
  };

  return (
    <Box>
      <Box className="headerSection">
        <Typography variant="h5" className="title">
          Quiz Verification
        </Typography>
        <Typography variant="h5" className="Quiz-subtitle">
          Answer the following questions correctly to verify your identity
        </Typography>
      </Box>

      <Box className="createAppointmentContainer">
        <form onSubmit={handleSubmit} className="Quiz-Form">
          {questions.map((question, index) => (
            <div className="questionContainer" key={question.id}>
              <Typography variant="body1" className="questionText">
                {`${index + 1}- ${question.question}`}
              </Typography>
              <FormControl component="fieldset" className="optionsContainer">
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedAnswers[question.id] === option}
                        onChange={() =>
                          handleCheckboxChange(question.id, option)
                        }
                        className="checkbox"
                      />
                    }
                    label={option}
                    className="optionLabel"
                  />
                ))}
              </FormControl>
            </div>
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submitButton"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default QuizApp;
