function getPlaceBadgeStyle(placeName){
    const palettes = [
        { bg: '#e0e7ff', text: '#3730a3' }, 
        { bg: '#fef3c7', text: '#92400e' }, 
        { bg: '#fce7f3', text: '#9d174d' }, 
        { bg: '#dbeafe', text: '#1e40af' }, 
        { bg: '#f3e8ff', text: '#6b21a8' }, 
        { bg: '#ffedd5', text: '#9a3412' }  
    ];
    
    let hash = 0;
    for (let i = 0; i < placeName.length; i++) {
        hash = placeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % palettes.length;
    const color = palettes[index];
    
    return `background-color: ${color.bg}; color: ${color.text}; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; white-space: nowrap;`;
}

document.addEventListener('DOMContentLoaded',function(){
    const sessionData = JSON.parse(localStorage.getItem('shiftly_session'));
    const currentTime = new Date().getTime();

    // [수정] 60분 세션 만료 체크 로직 추가
    if(!sessionData || currentTime > sessionData.expiry){
        alert('Session expired. Please log in again.');
        localStorage.removeItem('shiftly_session');
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('userGreeting').textContent = `Hello - ${sessionData.username}`;

    document.getElementById('logoutBtn').addEventListener('click',function(e){
        e.preventDefault();
        localStorage.removeItem('shiftly_session');
        window.location.href='login.html';
    });

    let allShifts = JSON.parse(localStorage.getItem('shiftly_shifts')) || [];
    
    let userShifts = allShifts.filter(shift => shift.username === sessionData.username);

    renderTable(userShifts);
    calculateHighestMonth(userShifts);

    document.getElementById('filterBtn').addEventListener('click',function(){
        const placeQuery = document.getElementById('searchPlace').value.toLowerCase();
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;

        let filtered = userShifts.filter(shift => {
            let matchPlace = shift.place.toLowerCase().includes(placeQuery);
            let matchDate = true;

            if (start && shift.date < start) matchDate = false;
            if (end && shift.date > end) matchDate = false;

            return matchPlace && matchDate;
        });

        renderTable(filtered);
    });
});

function renderTable(shiftArray){
    const tbody = document.getElementById('shiftTableBody');
    tbody.innerHTML='';

    if (shiftArray.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 50px 20px; color: #6b7280; background-color: #f9fafb;">
                    <div style="font-size: 2.5rem; margin-bottom: 10px;">📭</div>
                    <h3 style="margin-bottom: 5px; color: #374151;">No shifts found</h3>
                    <p style="font-size: 0.9rem;">You haven't added any shifts yet. Click the + button to start!</p>
                </td>
            </tr>
        `;
        return;
    }

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
            <td style="font-weight: 500;">
                <span style="${getPlaceBadgeStyle(shift.place)}">
                    ${shift.place}
                </span>
            </td>
            <td style="font-weight: 500;">
                <span style="background-color: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.9em;">
                    $${totalProfit.toFixed(2)}
                </span>
            </td>
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
    if (shiftArray.length === 0) {
        document.getElementById('highestMonthDisplay').textContent = 'N/A';
        return;
    }

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