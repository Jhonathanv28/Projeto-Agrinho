const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const statNumbers = document.querySelectorAll('.stat-number');
const sectionsToReveal = document.querySelectorAll('.reveal');
const calculateBtn = document.getElementById('calculateBtn');
const scoreValue = document.getElementById('scoreValue');
const scoreTitle = document.getElementById('scoreTitle');
const scoreText = document.getElementById('scoreText');
const progressCircle = document.getElementById('progressCircle');
const quizContainer = document.getElementById('quizContainer');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const quizResult = document.getElementById('quizResult');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const animateStats = () => {
  statNumbers.forEach(stat => {
    const target = Number(stat.dataset.target);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 40));

    const update = () => {
      current += increment;
      if (current >= target) {
        stat.textContent = target;
      } else {
        stat.textContent = current;
        requestAnimationFrame(update);
      }
    };

    update();
  });
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.id === 'tema') animateStats();
    }
  });
}, { threshold: 0.2 });

sectionsToReveal.forEach(section => observer.observe(section));

if (calculateBtn) {
  calculateBtn.addEventListener('click', () => {
    const checked = document.querySelectorAll('#sustainabilityForm input:checked');
    const total = Array.from(checked).reduce((sum, item) => sum + Number(item.value), 0);
    const circumference = 314;
    const offset = circumference - (total / 100) * circumference;

    progressCircle.style.strokeDashoffset = offset;
    scoreValue.textContent = `${total}%`;

    if (total === 100) {
      scoreTitle.textContent = 'Excelente consciência sustentável!';
      scoreText.textContent = 'Você reconhece que produzir com responsabilidade é o melhor caminho para o futuro do planeta.';
    } else if (total >= 60) {
      scoreTitle.textContent = 'Muito bom!';
      scoreText.textContent = 'Você já domina várias atitudes importantes. Continue fortalecendo a relação entre agro e preservação.';
    } else if (total > 0) {
      scoreTitle.textContent = 'Bom começo!';
      scoreText.textContent = 'Você já entende parte do processo. Aprender mais sobre sustentabilidade ajuda a ampliar seu impacto positivo.';
    } else {
      scoreTitle.textContent = 'Vamos começar?';
      scoreText.textContent = 'Marque pelo menos uma atitude sustentável para visualizar seu resultado.';
    }
  });
}

const quizData = [
  {
    question: 'Qual prática ajuda a conservar a fertilidade do solo?',
    options: ['Queimada frequente', 'Rotação de culturas', 'Desperdício de água'],
    answer: 'Rotação de culturas'
  },
  {
    question: 'O que significa sustentabilidade no campo?',
    options: ['Produzir sem pensar no futuro', 'Equilibrar produção, sociedade e meio ambiente', 'Usar recursos naturais sem controle'],
    answer: 'Equilibrar produção, sociedade e meio ambiente'
  },
  {
    question: 'Qual atitude contribui para a preservação da água?',
    options: ['Irrigação inteligente', 'Desmatamento', 'Poluição de nascentes'],
    answer: 'Irrigação inteligente'
  }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

function renderQuestion() {
  const current = quizData[currentQuestion];
  selectedOption = null;
  quizContainer.innerHTML = `
    <div class="quiz-question">${current.question}</div>
    <div class="quiz-options">
      ${current.options.map(option => `<button class="quiz-option" type="button">${option}</button>`).join('')}
    </div>
  `;

  const optionButtons = document.querySelectorAll('.quiz-option');
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      optionButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedOption = button.textContent;
    });
  });

  nextQuestionBtn.textContent = currentQuestion === quizData.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
}

nextQuestionBtn.addEventListener('click', () => {
  if (!selectedOption) {
    quizResult.textContent = 'Selecione uma alternativa para continuar.';
    return;
  }

  if (selectedOption === quizData[currentQuestion].answer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    quizResult.textContent = '';
    renderQuestion();
  } else {
    quizContainer.innerHTML = `
      <div class="quiz-question">Quiz finalizado!</div>
      <p>Você acertou <strong>${score}</strong> de <strong>${quizData.length}</strong> perguntas.</p>
    `;

    if (score === quizData.length) {
      quizResult.textContent = 'Parabéns! Você compreendeu muito bem a importância de unir agro e sustentabilidade.';
    } else if (score >= 2) {
      quizResult.textContent = 'Ótimo resultado! Você está no caminho certo para defender um futuro sustentável.';
    } else {
      quizResult.textContent = 'Continue estudando! Cada aprendizado fortalece o cuidado com o campo e o meio ambiente.';
    }

    nextQuestionBtn.style.display = 'none';
  }
});

renderQuestion();