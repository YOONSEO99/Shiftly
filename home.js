document.addEventListener('DOMContentLoaded',function(){
    const sessionData = JSON.parse(localStorage.getItem('shiftly_session'));
    if(!sessionData){
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('userGreeting').textContent = `Hello - ${sessionData.username}`;

    document.getElementById('logoutBtn').addEventListener('click',function(e){
        e.preventDefault();
        localStorage.removeItem('shiftly_session');
        window.location.href='login.html';
    });

    let shifts = JSON.parse(localStorage.getItem('shiftly_shifts'));
    if(!shifts||shifts.length===0){
        shifts = [
            { id: 1, date: '2026-03-12', startTime: '10:00', endTime: '15:00', wage: 18.5, place: 'Sushi Hanabi', comment: '' },
            { id: 2, date: '2026-03-14', startTime: '13:00', endTime: '17:00', wage: 20, place: 'KDD Event Prep', comment: '' },
            { id: 3, date: '2026-04-05', startTime: '09:00', endTime: '18:00', wage: 25, place: 'Freelance Web', comment: '' }
        ];
        localStorage.setItem('shiftly_shifts', JSON.stringify(shifts));
    }

    renderTable(shifts);
    calculateHighestMonth(shifts);

    document.getElementById('filterBtn').addEventListener('click',function(){
        const placeQuery = document.getElementById('searchPlace').value.toLowerCase();
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;

        let filtered = shifts.filter(shift => {
            let matchPlace = shift.place.toLowerCase().includes(placeQuery);
            let matchDate = true;

            if (start && shift.date < start) matchDate = false;
            if (end&&shift.date > end) matchDate = false;

            return matchPlace && matchDate;
        });

        renderTable(filtered);
    });
});

function renderTable(shiftArray){
    const tbody = document.getElementById('shiftTableBody');
    tbody.innerHTML='';

    shiftArray.forEach(shift =>{
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => window.location.href = `add-shift.html?id=${shift.id}`;

        const totalProfit = calculateProfit(shift.startTime, shift.endTime, shift.wage);
        tr.innerHTML = `
            <td>${shift.date}</td>
            <td>${shift.startTime}</td>
            <td>${shift.endTime}</td>
            <td>$${Number(shift.wage).toFixed(2)}</td>
            <td>${shift.place}</td>
            <td style="color: #2ecc71; font-weight: bold;">$${totalProfit.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateProfit(start,end,wage){
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let hours = (endHour + endMin / 60) - (startHour + startMin / 60);
    if (hours < 0) hours += 24; 
    
    return hours * wage;
}

function calculateHighestMonth(shiftArray) {
    if (shiftArray.length === 0) return;

    const monthlyProfits = {};

    shiftArray.forEach(shift => {
        const monthKey = shift.date.substring(0, 7); 
        const profit = calculateProfit(shift.startTime, shift.endTime, shift.wage);
        
        if (!monthlyProfits[monthKey]) {
            monthlyProfits[monthKey] = 0;
        }
        monthlyProfits[monthKey] += profit;
    });

    let highestMonth = '';
    let maxProfit = 0;

    for (const [month, profit] of Object.entries(monthlyProfits)) {
        if (profit > maxProfit) {
            maxProfit = profit;
            highestMonth = month;
        }
    }

    if (highestMonth) {
        document.getElementById('highestMonthDisplay').textContent = `${highestMonth} (Total: $${maxProfit.toFixed(2)})`;
    }
}