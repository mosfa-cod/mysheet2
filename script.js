 let studentData = { name: '', seat: '', score: 0 };

// تم إصلاح الرابط هنا بدقة تامة وبدون تداخل نصوص
const webAppUrl = "https://script.google.com/macros/s/AKfycbx6YdOX7-C57i46yYR-stBf_ajmlFDXfEY_oYbFEjq8kdVV2T-nkMCzWpiNAWthHA84/exec"; 

const questions = [
  { q: "ما هو ناتج جمع 5 + 7؟", options: ["10", "11", "12", "13"], answer: "12" }
];

document.getElementById('startQuizBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('studentName').value.trim();
    const seatInput = document.getElementById('seatNumber').value.trim();
    
    if (nameInput === "" || seatInput === "") {
        alert("من فضلك أدخل الاسم ورقم الجلوس");
        return;
    }
    
    studentData.name = nameInput;
    studentData.seat = seatInput;
    
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    
    loadQuestion();
});

function loadQuestion() {
    const currentQ = questions[0];
    document.getElementById('questionText').innerText = currentQ.q;
    
    const wrapper = document.getElementById('optionsWrapper');
    wrapper.innerHTML = "";
    
    currentQ.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = opt;
        
        btn.onclick = function() {
            if(opt === currentQ.answer) { 
                studentData.score = 4; 
            }
            sendDataToGoogleSheets();
        };
        
        wrapper.appendChild(btn);
    });
    
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(b => b.style.pointerEvents = 'none');
    
    setTimeout(() => {
        allOptions.forEach(b => b.style.pointerEvents = 'auto');
    }, 500); 
}

function sendDataToGoogleSheets() {
    const payload = {
        studentName: studentData.name,
        seatNumber: studentData.seat,
        studentScore: studentData.score + " / 4",
        subjectName: "الرياضيات"
    };
    
    fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("تم تسجيل إجابتك وإرسال النتيجة بنجاح!");
    })
    .catch(err => console.error("خطأ في الإرسال:", err));
}
