document.addEventListener('DOMContentLoaded',function(){
    const sessionData = JSON.parse(localStorage.getItem('shiftly_session'));
    if(!sessionData){
        window.location.href='login.html';
        return;
    }

    document.getElementById('addShiftForm').addEventListener('submit',function(e){
        e.preventDefault();

        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent='';

        const shiftDate = document.getElementById('shiftDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const hourlyWage =document.getElementById('hourlyWage').value;
        const workplace = document.getElementById('workplace').value;
        const shiftSlug = document.getElementById('shiftSlug').value.trim();
        const comments = document.getElementById('comments').value;

        let shifts = JSON.parse(localStorage.getItem('shiftly_shifts')) || [];

        const slugExists = shifts.some(shift=>shift.slug===shiftSlug);
        if(slugExists){
            errorElement.textContent = 'This Shift Slug already exists. Please choose a new name.';
            return;
        }

        const saveBtn = document.getElementById('saveBtn');
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('spinner');

        saveBtn.disabled = true;
        saveBtn.style.backgroundColor = '#95a5a6';
        btnText.textContent = 'Saving...';
        spinner.style.display = 'block';

        setTimeout(() => {
            const newShift = {
                id: Date.now(), 
                username: sessionData.username, 
                date: shiftDate,
                startTime: startTime,
                endTime: endTime,
                wage: parseFloat(hourlyWage),
                place: workplace,
                slug: shiftSlug,
                comments: comments
            };

            shifts.push(newShift);
            localStorage.setItem('shiftly_shifts', JSON.stringify(shifts));
            window.location.href = 'index.html';
        }, 1500);
    });
});