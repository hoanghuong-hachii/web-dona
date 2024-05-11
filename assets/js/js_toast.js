function toast({
    title='',
    message='',
    type='info',
    duration =3000
}){
    const main = document.getElementById('toast');
    if(main){
        const toast = document.createElement('div');

        const autoRemoveId = setTimeout(function(){
            main.removeChild(toast)
        },duration +1000);
    
        toast.onclick = function(e){
            if(e.target.closest('.toast__close')){
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        }
        const icons = {
            success:'fa-solid fa-circle-check',
            info:'fa-solid fa-circle-info',
            warning:'fa-solid fa-triangle-exclamation',
            error:'fa-solid fa-circle-exclamation',
        }
        const icon = icons[type];
        toast.classList.add('toast',`toast--${type}`);
        toast.style.animation= `slideInLeft .3s ease, fadeOut linear 1s ${duration}ms forwards`;

        toast.innerHTML = `
            
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark"></i>
            </div>`
            
            ;
            main.appendChild(toast);

    }


}


function showSuccessToast(data){
    
    toast({
        title: 'Success',
        message: data.msg,
        type: 'success',
        duration: 5000
    })
}
function showErrorToast(){
    toast({
        title: 'Error',
        message: '123 Font Awesome offers thousands of icons in 9 styles and 68 categories',
        type: 'error',
        duration: 5000
    })
}

function showWarningToast(){
    toast({
        title: 'Warning',
        message: '123 Font Awesome offers thousands of icons in 9 styles and 68 categories',
        type: 'warning',
        duration: 5000
    })
}

function showInfoToast(){
    toast({
        title: 'Info',
        message: '123 Font Awesome offers thousands of icons in 9 styles and 68 categories',
        type: 'info',
        duration: 5000
    })
}