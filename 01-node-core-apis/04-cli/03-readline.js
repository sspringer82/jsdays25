import { createInterface } from "readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });

function generateMathProblem() {
  const operations = ["+", "-", "*", "/"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1, num2, result;

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 100);
      num2 = Math.floor(Math.random() * 100);
      result = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * 100);
      num2 = Math.floor(Math.random() * num1); 
      result = num1 - num2;
      break;
    case "*":
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      result = num1 * num2;
      break;
    case "/":
      num2 = Math.floor(Math.random() * 10) + 1;
      result = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * result; 
      break;
  }

  return {
    question: `Was ist ${num1} ${operation} ${num2}?`,
    answer: result,
  };
}

async function runMathQuiz() {
  let score = 0;
  let totalQuestions = 0;

  console.log("Willkommen zum Mathe-Quiz!");
  console.log('Beantworte die Rechenaufgaben. Drücke "q" zum Beenden.\n');

  while (true) {
    const problem = generateMathProblem();
    totalQuestions++;

    const userAnswer = await rl.question(
      `Frage ${totalQuestions}: ${problem.question} `
    );

    if (userAnswer.toLowerCase() === "q") {
      break;
    }

    const numAnswer = parseFloat(userAnswer);

    if (isNaN(numAnswer)) {
      console.log("Bitte gib eine Zahl ein.");
    } else if (numAnswer === problem.answer) {
      console.log("Richtig! 👍");
      score++;
    } else {
      console.log(`Falsch. Die richtige Antwort ist ${problem.answer}.`);
    }

    console.log(`Dein aktueller Punktestand: ${score} von ${totalQuestions}\n`);
  }

  console.log(
    `Quiz beendet. Dein Endergebnis: ${score} von ${
      totalQuestions - 1
    } (${Math.round(score / (totalQuestions - 1) * 100)}%)`
  );

  rl.close();
}

runMathQuiz().catch(console.error);
