document.addEventListener('DOMContentLoaded',function(){
    const sessionData = JSON.parse(localStorage.getItem('shiftly_session'));
    if(!sessionData){
        window.location.href='login.html';
        return;
    }

    let shifts = JSON.parse(localStorage.getItem('shiftly_shifts')) || [];

    let savedPlaces = JSON.parse(localStorage.getItem('shiftly_places')) || [];
    if(!savedPlaces || savedPlaces.length === 0){
        savedPlaces = ['Sushi Garden', 'KDD Event Prep', 'Freelance'];
        localStorage.setItem('shiftly_places',JSON.stringify(savedPlaces));
    } 

    const dataList = document.getElementById('placeOptions');
    savedPlaces.forEach(place => {
        const option = document.createElement('option');
        option.value=place;
        dataList.appendChild(option);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    let isEditMode = false;

    if(editId){
        isEditMode = true;
        const shiftToEdit = shifts.find(s=>s.id.toString()===editId);

        if (shiftToEdit) {
            const headerTitle = document.querySelector('h2');
            if(headerTitle) headerTitle.textContent = 'Edit Shift';
            document.getElementById('btnText').textContent = 'Update Shift';
            
            document.getElementById('shiftDate').value = shiftToEdit.date;
            document.getElementById('startTime').value = shiftToEdit.startTime;
            document.getElementById('endTime').value = shiftToEdit.endTime;
            document.getElementById('hourlyWage').value = shiftToEdit.wage;
            document.getElementById('workplace').value = shiftToEdit.place;
            document.getElementById('shiftSlug').value = shiftToEdit.slug;
            document.getElementById('comments').value = shiftToEdit.comments || '';
        }
    }

    document.getElementById('addShiftForm').addEventListener('submit',function(e){
        e.preventDefault();

        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent='';

        const shiftDate = document.getElementById('shiftDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const hourlyWage =document.getElementById('hourlyWage').value;
        const workplace = document.getElementById('workplace').value.trim();
        const shiftSlug = document.getElementById('shiftSlug').value.trim();
        const comments = document.getElementById('comments').value;

        let shifts = JSON.parse(localStorage.getItem('shiftly_shifts')) || [];

        const slugExists = shifts.some(shift=>shift.slug===shiftSlug && shift.id.toString() !== editId);
        if(slugExists){
            errorElement.textContent = 'This Shift Slug already exists. Please choose a new name.';
            return;
        }

        const saveBtn = document.getElementById('saveBtn');
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('spinner');

        saveBtn.disabled = true;
        saveBtn.style.backgroundColor = '#95a5a6';
        btnText.textContent = isEditMode? 'Updating...' : 'Saving...';
        spinner.style.display = 'block';

        setTimeout(() => {
            if (!savedPlaces.includes(workplace)){
                savedPlaces.push(workplace);
                localStorage.setItem('shiftly_places',JSON.stringify(savedPlaces));
            }

            const shiftDataObj = {
                id: isEditMode? Number(editId) : Date.now(), 
                username: sessionData.username, 
                date: shiftDate,
                startTime: startTime,
                endTime: endTime,
                wage: parseFloat(hourlyWage),
                place: workplace,
                slug: shiftSlug,
                comments: comments
            };

            if (isEditMode){
                shifts = shifts.map(s=>s.id.toString()===editId?shiftDataObj:s);
            }else{
                shifts.push(shiftDataObj);
            }
            
            localStorage.setItem('shiftly_shifts', JSON.stringify(shifts));
            window.location.href = 'index.html';
        }, 1500);
    });
});