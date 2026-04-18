let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveData(){
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateBalance(){
    let total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    document.getElementById("balance").innerText = "$" + total.toFixed(2);
}

function addTransaction(){
    let name = document.getElementById("itemName").value;
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;

    if(name && amount){
        transactions.push({name, amount, category});
        saveData();
        renderTransactions();
        updateBalance();
        drawChart();
    }
}

function deleteTransaction(index){
    transactions.splice(index,1);
    saveData();
    renderTransactions();
    updateBalance();
    drawChart();
}

function renderTransactions(){
    let list = document.getElementById("transactionList");
    list.innerHTML = "";

    transactions.forEach((t,i)=>{
        list.innerHTML += `
        <li>
            <div>
                <strong>${t.name}</strong><br>
                <span>$${t.amount}</span><br>
                <small>${t.category}</small>
            </div>
            <button class="delete" onclick="deleteTransaction(${i})">Delete</button>
        </li>`;
    });
}

function drawChart(){
    let canvas = document.getElementById("chartCanvas");
    let ctx = canvas.getContext("2d");
    let legend = document.getElementById("legend");

    ctx.clearRect(0,0,canvas.width,canvas.height);
    legend.innerHTML = "";

    let totals = {};
    transactions.forEach(t=>{
        totals[t.category]=(totals[t.category]||0)+Number(t.amount);
    });

    let colors=["#2ecc71","#3498db","#e67e22","#9b59b6","#e74c3c"];
    let start=0;
    let totalSum = Object.values(totals).reduce((a,b)=>a+b,0);
    let i=0;

    for(let cat in totals){
        let slice = (totals[cat]/totalSum)*2*Math.PI;

        ctx.beginPath();
        ctx.moveTo(150,150);
        ctx.arc(150,150,150,start,start+slice);
        ctx.fillStyle=colors[i];
        ctx.fill();

        legend.innerHTML += `
        <div class="legend-item">
            <div class="color-box" style="background:${colors[i]}"></div>
            <span>${cat}</span>
        </div>
        `;

        start+=slice;
        i++;
    }
}

renderTransactions();
updateBalance();
drawChart();