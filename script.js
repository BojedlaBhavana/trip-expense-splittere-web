// script.js

let members = [];
let expenses = [];
let editIndex = null;

function createTrip(){

    const tripName =
    document.getElementById("trip-name").value;

    const memberInput =
    document.getElementById("members-input").value;

    if(tripName === "" || memberInput === ""){
        alert("Please enter trip details");
        return;
    }

    members =
    memberInput.split(",").map(member => member.trim());

    document.getElementById("dashboard").style.display =
    "block";

    document.getElementById("trip-title").innerText =
    tripName;

    document.getElementById("member-count").innerText =
    members.length;

    const payerSelect =
    document.getElementById("payer-select");

    payerSelect.innerHTML =
    members.map(member =>
        `<option>${member}</option>`
    ).join("");
}

function openModal(){

    document.getElementById("modal").style.display =
    "flex";
}

function closeModal(){

    document.getElementById("modal").style.display =
    "none";
}

function saveExpense(){

    const amount =
    parseFloat(
        document.getElementById("expense-amount").value
    );

    const payer =
    document.getElementById("payer-select").value;

    const category =
    document.getElementById("category-select").value;

    if(isNaN(amount) || category === ""){
        alert("Please enter all details");
        return;
    }

    const expense = {
        amount,
        payer,
        category
    };

    if(editIndex === null){

        expenses.push(expense);

    }else{

        expenses[editIndex] = expense;

        editIndex = null;
    }

    closeModal();

    updateUI();

    document.getElementById("expense-amount").value = "";
    document.getElementById("category-select").value = "";
}

function updateUI(){

    let total = 0;

    expenses.forEach(expense => {
        total += expense.amount;
    });

    let share = total / members.length;

    document.getElementById("total-expense").innerText =
    "₹" + total.toLocaleString("en-IN");

    document.getElementById("fair-share").innerText =
    "₹" + Math.round(share).toLocaleString("en-IN");

    document.getElementById("expense-count").innerText =
    expenses.length;

    const expenseList =
    document.getElementById("expense-list");

    expenseList.innerHTML =
    expenses.map((expense,index) =>

    `
    <div class="expense-item">

        <div class="left">

            <div class="avatar">
                ${expense.payer[0].toUpperCase()}
            </div>

            <div>

                <strong>${expense.category}</strong>

                <br>

                <small>
                    Paid by ${expense.payer}
                </small>

            </div>

        </div>

        <div class="right">

            <strong>
                ₹${expense.amount.toLocaleString("en-IN")}
            </strong>

            <div class="action-buttons">

                <button
                onclick="editExpense(${index})"
                class="edit-btn">

                    Edit

                </button>

                <button
                onclick="deleteExpense(${index})"
                class="delete-btn">

                    Delete

                </button>

            </div>

        </div>

    </div>
    `

    ).join("");

    updateSummary(share);
}

function deleteExpense(index){

    expenses.splice(index,1);

    updateUI();
}

function editExpense(index){

    const expense = expenses[index];

    document.getElementById("expense-amount").value =
    expense.amount;

    document.getElementById("payer-select").value =
    expense.payer;

    document.getElementById("category-select").value =
    expense.category;

    editIndex = index;

    openModal();
}

function updateSummary(share){

    const summaryBody =
    document.getElementById("summary-body");

    let balances = [];

    summaryBody.innerHTML =
    members.map(member => {

        let paid = 0;

        expenses.forEach(expense => {

            if(expense.payer === member){
                paid += expense.amount;
            }

        });

        let balance = paid - share;

        balances.push({
            name:member,
            balance:balance
        });

        return `
        <tr>

            <td>${member}</td>

            <td>
                ₹${paid.toLocaleString("en-IN")}
            </td>

            <td style="
                color:${balance >= 0 ? 'green':'red'}
            ">

                ₹${Math.round(balance).toLocaleString("en-IN")}

            </td>

        </tr>
        `;

    }).join("");

    calculateSettlement(balances);
}

function calculateSettlement(balances){

    let creditors =
    balances.filter(person => person.balance > 0);

    let debtors =
    balances.filter(person => person.balance < 0);

    let html = "";

    debtors.forEach(debtor => {

        creditors.forEach(creditor => {

            if(
                debtor.balance < 0 &&
                creditor.balance > 0
            ){

                let amount =
                Math.min(
                    Math.abs(debtor.balance),
                    creditor.balance
                );

                html += `
                <div class="settlement-item">

                    ${debtor.name}
                    pays
                    ₹${Math.round(amount).toLocaleString("en-IN")}
                    to
                    ${creditor.name}

                </div>
                `;

                debtor.balance += amount;

                creditor.balance -= amount;
            }

        });

    });

    document.getElementById("settlement-list").innerHTML =
    html;
}

function toggleDarkMode(){

    document.body.classList.toggle("dark");
}