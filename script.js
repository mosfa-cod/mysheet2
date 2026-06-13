 let studentData = { name: '', seat: '', score: 0 };

// 🛠️ تم إرجاع رابط الـ Apps Script الحقيقي الخاص بك هنا بدلاً من جوجل لتجنب عطل وتجمد الكود
const webAppUrl = "https://script.google.com/macros/s/AKfycbx6YdOX7-C57i46yYR-stBf_ajmlFDXfEY_oYbFEjq8kdVV2T-nkMCzWpiNAWthHA84/exec"; 

// 📝 قائمة الأسئلة الثلاثة الحالية
const questions = [
  { q: "ما هو ناتج جمع 5 + 7؟", options: ["10", "11", "12", "13"], answer: "12" },
  { q: "ما هو ناتج ضرب 3 × 4؟", options: ["7", "12", "14", "16"], answer: "12" },
  { q: "ما هو ناتج طرح 20 - 8؟", options: ["10", "11", "12", "13"], answer: "12" }
];

let currentQuestionIndex = 0; // عداد الأسئلة الحالي

document.getElementById('startQuizBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('studentName').value.trim();
    const seatInput = document.getElementById('seatNumber').value.trim();
    
    if (nameInput === "" || seatInput === "") {
        alert("من فضلك أدخل الاسم ورقم الجلوس أولاً!");
        return;
    }
    
    studentData.name = nameInput;
    studentData.seat = seatInput;
    studentData.score = 0; 
    currentQuestionIndex = 0;
    
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    
    loadQuestion();
});

function loadQuestion() {
    // التحقق مما إذا انتهت الأسئلة الثلاثة
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    document.getElementById('questionText').innerText = currentQ.q;
    
    const wrapper = document.getElementById('optionsWrapper');
    wrapper.innerHTML = "";
    
    currentQ.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = opt;
        
        btn.onclick = function() {
            // احتساب الدرجة إذا كانت الإجابة صحيحة
            if(opt === currentQ.answer) { 
                studentData.score += 1; 
            }
            
            // الانتقال التلقائي للسؤال التالي فوراً
            currentQuestionIndex++;
            loadQuestion();
        };
        
        wrapper.appendChild(btn);
    });
    
    // 🛡️ درع الحماية لمنع اللخبطة وقت ظهور السؤال
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(b => b.style.pointerEvents = 'none');
    
    setTimeout(() => {
        allOptions.forEach(b => b.style.pointerEvents = 'auto');
    }, 400); 
}

// دالة إنهاء الامتحان وإرسال النتيجة النهائية لجوجل شيتس مرة واحدة بعد نهاية السؤال الثالث
function endQuiz() {
    document.getElementById('quizScreen').innerHTML = "<h2>جاري إرسال النتيجة النهائية، برجاء الانتظار...</h2>";
    
    const payload = {
        studentName: studentData.name,
        seatNumber: studentData.seat,
        studentScore: studentData.score + " / " + questions.length,
        subjectName: "الرياضيات"
    };
    
    fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("تم إنهاء الاختبار وتسجيل النتيجة النهائية بنجاح! 🎉");
        document.getElementById('quizScreen').innerHTML = "<h2>شكرًا لك يا " + studentData.name + "، تم تسجيل درجتك بنجاح!</h2>";
    })
    .catch(err => {
        console.error("خطأ في الإرسال:", err);
        document.getElementById('quizScreen').innerHTML = "<h2>حدث خطأ أثناء إرسال النتيجة، يرجى إبلاغ المعلم.</h2>";
    });
}
