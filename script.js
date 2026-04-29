　
  function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let currentIndex = 0;
let currentList = [];
let quizCount = 0;
let correctCount = 0;
let usedHint = false;

const totalQuestions = 10;
const questionModeSelect = document.getElementById("questionMode");
const wordCategorySelect = document.getElementById("wordCategory");
const sentenceDiv = document.getElementById("sentence");
const jpDiv = document.getElementById("jp");
const input = document.getElementById("input");
const resultDiv = document.getElementById("result");
console.log("JS loaded");
const showAnswerBtn = document.getElementById("showAnswerBtn");

document.getElementById("questionMode").addEventListener("change", function () {
  const gameContainer = document.getElementById("gameContainer");

  if (this.value === "query") {
    gameContainer.classList.add("query-mode");
  } else {
    gameContainer.classList.remove("query-mode");
  }
});
// --- 問題表示 ---
function loadSentence() {
  
  console.log("loadSentence called", currentList.length);

  sentenceDiv.innerHTML = "";

  usedHint = false;
  
  sentenceDiv.style.display = "block";
jpDiv.style.display = "block";
input.style.display = "block";

  sentenceDiv.style.fontSize = "";
  sentenceDiv.style.color = "";

  if (currentList.length === 0) {
    sentenceDiv.textContent = "問題がありません";
    jpDiv.textContent = "";
    return;
  }

  const item = currentList[currentIndex];
 
 if (questionModeSelect.value === "query") {
  sentenceDiv.textContent = item.ja;
  jpDiv.textContent = "英文を入力してください";
  jpDiv.style.color = "#b08a8a";
  adjustQueryFontSize(item.ja);
   
 } else {
  sentenceDiv.textContent = item.en;
  jpDiv.textContent = "";
  jpDiv.style.color = "#6b4f4f";
  adjustSentenceFontSize(item.en);
 }

  input.value = "";
  resultDiv.textContent = "";
  resultDiv.style.color = "";
  
 
  input.disabled = false;
  input.style.display = "block";
  input.scrollIntoView({ behavior: "smooth", block: "center" });
  input.focus();
}

function adjustSentenceFontSize(text) {
  const length = text.length;
  const longestWord = Math.max(...text.split(" ").map(word => word.length));

  if (window.innerWidth <= 900) {
    if (longestWord > 18) {
      sentenceDiv.style.fontSize = "34px";
    } else if (length <= 30) {
      sentenceDiv.style.fontSize = "48px";
    } else if (length <= 60) {
      sentenceDiv.style.fontSize = "38px";
    } else if (length <= 100) {
      sentenceDiv.style.fontSize = "34px";
    } else {
      sentenceDiv.style.fontSize = "28px";
    }
  } else {
    if (length <= 40) {
      sentenceDiv.style.fontSize = "48px";
    } else if (length <= 80) {
      sentenceDiv.style.fontSize = "40px";
    } else if (length <= 120) {
      sentenceDiv.style.fontSize = "32px";
    } else {
      sentenceDiv.style.fontSize = "26px";
    }
  }
}

function adjustQueryFontSize(text) {
  const length = text.length;

  if (window.innerWidth <= 900) {
    if (length <= 20) {
      sentenceDiv.style.fontSize = "34px";
    } else if (length <= 40) {
      sentenceDiv.style.fontSize = "26px";
    } else if (length <= 70) {
      sentenceDiv.style.fontSize = "22px";
    } else {
      sentenceDiv.style.fontSize = "20px";
    }
  } else {
    if (length <= 20) {
      sentenceDiv.style.fontSize = "32px";
    } else if (length <= 40) {
      sentenceDiv.style.fontSize = "26px";
    } else if (length <= 70) {
      sentenceDiv.style.fontSize = "22px";
    } else {
      sentenceDiv.style.fontSize = "20px";
    }
  }
}

// --- タイピング判定 ---
input.addEventListener("keydown", (e) => {
  
  if (e.key === "Enter") {
    const target =
    questionModeSelect.value === "query"
    ? currentList[currentIndex].en.trim()
    : currentList[currentIndex].ja.trim(); 

    const typed = input.value.trim();

    if (typed === target) {
      resultDiv.style.display = "block";
      resultDiv.style.color = "#c2185b";
      resultDiv.textContent = "Correct!";

      input.disabled = true;

     setTimeout(() => {
  
  quizCount++;

  if (!usedHint) {
  correctCount++;
  }

  if (quizCount >= totalQuestions) {
    const rate = Math.round((correctCount / totalQuestions) * 100);

    sentenceDiv.style.display = "none";
    jpDiv.style.display = "none";
    input.style.display = "none";
    showAnswerBtn.style.display = "none";

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
  <div style="
    background: #fff0f6;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    text-align: center;
  ">
    <div style="font-size:32px;">🎉</div>
    <div style="
      font-size:26px;
      font-weight:bold;
      color:#d63384;
      margin-bottom:12px;
    ">
      おつかれさま！
    </div>

    <div style="font-size:20px; margin-bottom:8px;">
      ${totalQuestions}問中 <b>${correctCount}</b> 問正解
    </div>

    <div style="
      font-size:28px;
      font-weight:bold;
      color:#c2185b;
      margin-bottom:12px;
    ">
      正答率：${rate}%
    </div>

    <div style="font-size:18px; color:#555;">
      ${rate === 100 ? "完璧！すばらしい！" :
        rate >= 80 ? "いいかんじ！" :
        rate >= 60 ? "まあまあだね！" :
        "次はもっといける！"}
    </div>
  </div>
`;    return;
  }

  currentIndex++;

  if (currentIndex >= currentList.length) {
    currentIndex = 0;
    shuffleArray(currentList);
  }

  input.disabled = false;
  loadSentence();
}, 2000); 

   } else {
  resultDiv.style.display = "block";
  resultDiv.style.color = "red";
  resultDiv.textContent = "Miss!";
   }
  }
}); 
 

// --- 初期化 ---
function init() {
  quizCount = 0;
  correctCount = 0;
  showAnswerBtn.style.display = "inline-block";

  resultDiv.style.display = "none";
  input.disabled = false;
  input.value = "";

  if (questionModeSelect.value === "word" && !wordCategorySelect.value) {
    wordCategorySelect.value = "clinical";
  }

  if (questionModeSelect.value === "word") {
    const category = wordCategorySelect.value;
    currentList = category === "all" 
      ? [
         ...sentenceData.word.clinical, 
         ...sentenceData.word.disease, 
         ...sentenceData.word.symptom, 
         ...sentenceData.word.treatment
       ]
      : sentenceData.word[category] || [];
 
 } else if (questionModeSelect.value === "query") {
  currentList = sentenceData.query;
 }
  shuffleArray(currentList);
  currentIndex = 0;
  
  loadSentence();
  }

showAnswerBtn.addEventListener("click", () => {
  usedHint = true;

  const answer =
  questionModeSelect.value === "query"
    ? currentList[currentIndex].en
    : currentList[currentIndex].ja; 
 
  resultDiv.style.display = "block";
  resultDiv.textContent = `正解：${answer}`;

  input.value = "";
  input.focus();
});



// --- 設定変更 ---
questionModeSelect.addEventListener("change", () => {
    updateSelectVisibility();
    init();

});

wordCategorySelect.addEventListener("change", init);

document.addEventListener("DOMContentLoaded", () => {
 
  questionModeSelect.value = "word";
  updateSelectVisibility();
  init();
});


// --- 選択肢表示 ---
function updateSelectVisibility() {
  wordCategorySelect.style.display = 
    questionModeSelect.value === "word" ? "inline-block" : "none";
}

