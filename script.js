let currentIndex = 0;
let questionsCorrent = 0;
let questions = []; // carrega via fetch

const text = document.querySelector('.text');
const question = document.querySelector('.question');
const answers = document.querySelector('.answers');
const spnQtd = document.querySelector('.spnQtd');
const textFinish = document.querySelector('.finish span');
const content = document.querySelector('.content');
const contentFinish = document.querySelector('.finish');
const btnRestart = document.querySelector('.finish button');

async function carregarQuestoes() {
  try {
    const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const hoje = new Date().getDay(); // 0 = domingo, 1 = segunda...
    const nomeArquivo = `./${dias[hoje]}.json`;

    const response = await fetch(nomeArquivo);
    questions = await response.json();
    loadQuestion();
  } catch (error) {
    console.error("Erro ao carregar questões:", error);
    question.innerHTML = "Não foi possível carregar as questões de hoje.";
  }
}


function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    finish();
  }
}

function finish() {
  textFinish.innerHTML = `Você acertou ${questionsCorrent} de ${questions.length}`;
  content.style.display = 'none';
  contentFinish.style.display = 'flex';
}

function loadQuestion() {
  const feedback = document.querySelector('.feedback');
  const reforco = document.querySelector('.reforco');
  feedback.textContent = "";
  feedback.className = "feedback";
  reforco.textContent = "";
  reforco.style.display="none";

  spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
  const item = questions[currentIndex];
  text.innerHTML = '';
  answers.innerHTML = '';
  question.innerHTML = item.question;

  item.answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.classList.add("answer");
    btn.setAttribute("data-correct", answer.correct);
    btn.textContent = answer.option;
    answers.appendChild(btn);
  });

  document.querySelectorAll(".answer").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selected = e.target;
      const correct = selected.getAttribute("data-correct") === "true";
      reforco.style.display="block";
      reforco.textContent = item.reforço;
      // desabilita todos os botões
      document.querySelectorAll(".answer").forEach((b) => {
        b.disabled = true;
        if (b.getAttribute("data-correct") === "true") {
          b.classList.add("correct"); // verde
        }
      });

      if (correct) {
        questionsCorrent++;
        selected.classList.add("correct", "selected");
        feedback.textContent = "✅ Acertou!";
        feedback.className = "feedback correct";
      } else {
        selected.classList.add("wrong", "selected");
        feedback.textContent = "❌ Errou!";
        feedback.className = "feedback wrong";

        document.querySelectorAll(".answer").forEach((b) => {
          if (b.getAttribute("data-correct") === "true") {
            b.classList.add("correct");
          }
        });
      }



      // espera 1s e vai para a próxima
      setTimeout(nextQuestion, 15000);
    });
  });
}

btnRestart.addEventListener("click", () => {
  currentIndex = 0;
  questionsCorrent = 0;
  content.style.display = 'flex';
  contentFinish.style.display = 'none';
  loadQuestion();
});

carregarQuestoes();
