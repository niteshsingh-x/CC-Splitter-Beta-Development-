const inputEl = document.getElementById('numberInput');
const outputEl = document.getElementById('output');
const errorEl = document.getElementById('errorMessage');
const actionBarEl = document.getElementById('actionBar');
const copyAllBtn = document.getElementById('copyAllBtn');

let globalTextToCopy = '';

inputEl.addEventListener('input', calculateSplit);

copyAllBtn.addEventListener('click', () => {
    if (!globalTextToCopy) return;
    navigator.clipboard.writeText(globalTextToCopy).then(() => {
        copyAllBtn.textContent = 'All Copied!';
        copyAllBtn.classList.add('copied');
        setTimeout(() => {
            copyAllBtn.textContent = 'Copy All';
            copyAllBtn.classList.remove('copied');
        }, 2000);
    });
});

function calculateSplit() {
    const rawValue = inputEl.value.trim();
    outputEl.innerHTML = '';
    errorEl.style.display = 'none';
    actionBarEl.style.display = 'none';
    globalTextToCopy = '';

    if (!rawValue) return;

    const parsedTokens = rawValue.replace(/\//g, ' ').match(/\d+/g);

    if (!parsedTokens || parsedTokens.length < 2) {
        return; 
    }

    const values = parsedTokens.map(v => parseInt(v, 10));

    let serialNumber = 1;
    let baseNumbers = [];

    const serialIndex = values.findIndex(v => v.toString().length === 6);

    if (serialIndex !== -1) {
        serialNumber = values[serialIndex];
        baseNumbers = values.filter((_, idx) => idx !== serialIndex);
    } else {
        baseNumbers = values;
    }

    if (baseNumbers.length < 2) return;

    let totalNumbers = 0;
    let peopleCount = 0;

    const num1 = baseNumbers[0];
    const num2 = baseNumbers[1];

    if (num1 <= num2) {
        peopleCount = num1;
        totalNumbers = num2;
    } else {
        peopleCount = num2;
        totalNumbers = num1;
    }

    if (peopleCount <= 0 || totalNumbers <= 0) {
        showError("Values must be greater than zero.");
        return;
    }

    if (peopleCount > totalNumbers) {
        showError("People count cannot be greater than the total number pool.");
        return;
    }

    actionBarEl.style.display = 'flex';

    let baseCount = Math.floor(totalNumbers / peopleCount);
    let remainder = totalNumbers % peopleCount;

    let currentStart = serialNumber;
    let allLines = [];

    for (let i = 1; i <= peopleCount; i++) {
        let countForThisPerson = baseCount + (i <= remainder ? 1 : 0);
        let currentEnd = currentStart + countForThisPerson - 1;

        let displayStart = currentStart;
        let displayEnd = currentEnd;

        if (i === 1) {
            displayStart = "Start";
        }

        if (i === peopleCount) {
            displayEnd = "Last";
        }

        const rangeTextOnly = displayStart + " to " + displayEnd;
        const fullLineText = "person " + i + " = " + displayStart + " to " + displayEnd + " (" + countForThisPerson + " numbers)";
        allLines.push(fullLineText);

        const card = document.createElement('div');
        card.className = 'person-card';

        card.innerHTML = `
            <div class="card-content">
                <span class="person-title">person ${i}</span> = 
                <span class="range-highlight">${displayStart} to ${displayEnd}</span> 
                <span class="count-highlight">(${countForThisPerson} numbers)</span>
            </div>
            <button class="copy-btn">Copy</button>
        `;

        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(rangeTextOnly).then(() => {
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

        outputEl.appendChild(card);
        currentStart = currentEnd + 1;
    }

    globalTextToCopy = allLines.join('\n');
}

function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    actionBarEl.style.display = 'none';
}
