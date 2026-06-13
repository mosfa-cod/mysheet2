 // بنك أسئلة مادة الرياضيات التفاعلي
const quizData = [
    {
        question: "ما هو ناتج جمع: 25 + 15 ؟",
        options: ["30", "35", "40", "50"],
        correct: 2
    },
    {
        question: "ما هو ناتج ضرب: 6 × 7 ؟",
        options: ["42", "36", "49", "48"],
        correct: 0
    },
    {
        question: "اشترى أحمد 3 أقلام، سعر القلم 5 جنيهات. كم دفع أحمد؟",
        options: ["10 جنيهات", "15 جنيهاً", "20 جنيهاً", "8 جنيهات"],
        correct: 1
    },
    {
        question: "ما هو الرقم الذي يمثل نصف العدد 100؟",
        options: ["25", "40", "50", "60"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let studentName = "";
let seatNumber = "";

// ⚠️ توجيه البيانات مباشرة لـ "الورقة2" بالأسفل الخاصة بالرياضيات لفرزها تلقائياً
const subjectName = "الرياضيات"; 

// ⚠️ ضع رابط تطبيق الويب (Web App URL) المستخرج من الإصدار 11 الأخير لسكريبت جوجل هنا:
const webAppUrl = " https://script.google.com/macros/s/AKfycbx3_YE3aLVQwVJ1HH8P5kLHF_ZShxhnVwD_N_Ce3SOznUnWzXrtobY_EDDagw0G4xLs/exec"; 

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');

startBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('student-name').value.trim();
    const seatInput = document.getElementById('seat-number').value.trim();
    
    if (nameInput === "" || seatInput === "") {
        alert("من فضلك أدخل الاسم ورقم الجلوس أولاً!");
        return;
    }
    
    studentName = nameInput;
    seatNumber = seatInput;
    
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
});

function loadQuestion() {
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = quizData[currentQuestionIndex];
    progressText.innerText = `السؤال ${currentQuestionIndex + 1} من ${quizData.length}`;
    questionText.innerText = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedBtn, index) {
    const currentQuestion = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (index === currentQuestion.correct) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        allButtons[currentQuestion.correct].classList.add('correct');
    }
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('display-name').innerText = studentName;
    document.getElementById('display-seat').innerText = seatNumber;
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = quizData.length;

    const payload = {
        studentName: studentName,
        seatNumber: seatNumber,
        studentScore: `${score} / ${quizData.length}`,
        subjectName: subjectName
    };

    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        document.getElementById('upload-status').innerText = "✅ تم حفظ نتيجتك بنجاح في جدول بيانات الرياضيات!";
        document.getElementById('upload-status').className = "status-message";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById('upload-status').innerText = "❌ حدث خطأ أثناء إرسال النتيجة.";
        document.getElementById('upload-status').style.color = "red";
    });
}
