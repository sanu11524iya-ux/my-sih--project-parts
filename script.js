// State Management Engine
let totalIncome = 0;
let totalExpense = 0;

// Category Pools for Chart.js Mapping
let categoricalExpenses = {
    Education: 0,
    Food: 0,
    Rent: 0,
    Entertainment: 0,
    Others: 0
};

// Initialize Chart.js Context
const ctx = document.getElementById('budgetPieChart').getContext('2d');
let budgetPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: Object.keys(categoricalExpenses),
        datasets: [{
            data: Object.values(categoricalExpenses),
            backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#64748b']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Main Calculus & State Engine
function calculateBudgetMetrics() {
    let totalSavings = totalIncome - totalExpense;

    // Direct DOM Updates
    document.getElementById('total-income').innerText = `₹${totalIncome.toFixed(2)}`;
    document.getElementById('total-expense').innerText = `₹${totalExpense.toFixed(2)}`;
    document.getElementById('total-savings').innerText = `₹${totalSavings.toFixed(2)}`;

    // Re-render Graph Elements
    budgetPieChart.data.datasets[0].data = Object.values(categoricalExpenses);
    budgetPieChart.update();

    // Alert & Warning Logic Checks
    evaluateBudgetAlerts(totalSavings);
}

// Alert Criteria Rules
function evaluateBudgetAlerts(savings) {
    const alertBox = document.getElementById('system-alert');
    
    if (totalIncome === 0) {
        alertBox.style.display = 'none';
        return;
    }

    let spendingRatio = (totalExpense / totalIncome) * 100;

    if (spendingRatio >= 100) {
        alertBox.className = "alert-banner alert-danger";
        alertBox.innerText = `⚠️ CRITICAL WARNING: Total monthly expenses have exceeded your set budget! Deficit of ₹${Math.abs(savings).toFixed(2)}. Halt all non-essential daily spending immediately.`;
        alertBox.style.display = 'block';
    } else if (spendingRatio >= 80) {
        alertBox.className = "alert-banner alert-warning";
        alertBox.innerText = `⚠️ BUDGET WARNING: You have consumer-spent ${spendingRatio.toFixed(0)}% of your allowance. Check your daily expense items to secure upcoming savings!`;
        alertBox.style.display = 'block';
    } else {
        alertBox.style.display = 'none';
    }
}

// Event Capturing: Adding Budget
document.getElementById('income-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);

    totalIncome += amount;
    postTransactionItem(source, amount, 'income', 'Allowance / Capital');
    calculateBudgetMetrics();
    this.reset();
});

// Event Capturing: Registering Daily Expense
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const item = document.getElementById('expense-title').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;

    totalExpense += amount;
    categoricalExpenses[category] += amount;

    postTransactionItem(item, amount, 'expense', category);
    calculateBudgetMetrics();
    this.reset();
});

// Direct UI Log Stream Manipulation
function postTransactionItem(title, amount, orientation, group) {
    const stream = document.getElementById('transaction-stream');
    const placeholders = document.querySelectorAll('.empty-placeholder');
    placeholders.forEach(el => el.remove());

    const itemNode = document.createElement('li');
    itemNode.className = orientation === 'income' ? 'type-income' : 'type-expense';

    const timestamp = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    itemNode.innerHTML = `
        <div>
            <strong>${title}</strong> <small style="color: #64748b; display:block;">Category: ${group}</small>
            <span style="font-size:11px; color:#94a3b8;">Logged: ${timestamp}</span>
        </div>
        <span style="font-weight:bold; align-self: center;">
            ${orientation === 'income' ? '+' : '-'} ₹${amount.toFixed(2)}
        </span>
    `;
    stream.prepend(itemNode);
}
