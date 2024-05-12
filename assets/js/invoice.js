var is_Status = 0;
var nameImageSign = '20240507232203812.png'
var numDesign = 1;
var idCer = 1;
var env_Url = localStorage.getItem('env_url');


$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    const idInvoice = urlParams.get('idInvoice');

    var filePdf =localStorage.getItem('env_file');

    var currentTime = Date.now();
    console.log(currentTime);

    console.log(idInvoice)
    // var currentDatetime = moment().format('DD/MM/YYYY');
    // console.log(currentDatetime)
    // $('#date-time').text(currentDatetime);

    if (filePdf) {
        $('#pdfViewer').attr('src', env_Url+ '/images/' + filePdf);
    } else {
        console.error('File parameter not found.');
    }

    $('.overlay').on('click', function() {
        $('.overlay').hide()
        $('.modal-check ').hide()
        $('.modal-sign ').hide()
        $('.modal-pass').hide()

    })

    $('.close').on('click', function() {
        $('.overlay').hide()
        $('.modal-check ').hide()
        $('.modal-sign ').hide()
        $('.modal-draw').hide();
        $('.modal-design').hide();
        $('.modal-pass').hide()

    })

    $('#btn-continue').on('click', function() {
        $('.modal-sign ').hide()
        $('.modal-design').show();

    })

    $('#btn-continue-to-sign').on('click', function() {

        $('.modal-design').hide()

        if(numDesign == 1 || numDesign == 4) {
            is_Status =1;
            $('.modal-draw').show();
        } else {
            $('.modal-pass').show()
        }
        
    })

    $('.verify-btn').on('click', function() {
        $('.overlay').show()
        $('.modal-check ').show()
    })

    $('.sign-btn').on('click', function() {
        $('.overlay').show()
        $('.modal-sign').show()
    })

    $('#downloadButton').click(function(){
        var pdfSrc = $('#pdfViewer').attr('src');
        console.log(pdfSrc)
        downloadFile(pdfSrc);
    });

    $('#btn-add').click(function() {
        window.location.href='./register_CA.html'
    })

    $('.btn-cancel').click(function() {
        console.log('click cancel')
        $('.overlay').hide();
        $('.modal-sign').hide();
        $('.modal-draw').hide();
        $('.modal-design').hide();
        $('.modal-pass').hide()


    })
    
    function downloadFile(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
    
        xhr.setRequestHeader('ngrok-skip-browser-warning', 'true');
    
        xhr.onload = function () {
            if (xhr.status === 200) {
                var blob = xhr.response;
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'invoice_'+currentTime+ '.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to download file. Status:', xhr.status);
            }
        };
    
        xhr.onerror = function () {
            console.error('Error occurred while downloading file.');
        };
    
        xhr.send();
    }
    //==========================Begin ===============================================================================================
    var idUser =localStorage.getItem('env_id');
    console.log(idUser)
    $.ajax({
        url:  env_Url + '/api/v1/register-certificates/user/' + idUser,
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'
        },
        success: function(data) {

            //data.forEach(function(certificate) {
            certificate = data;
            idCer = certificate.id
            console.log('idCer: ' + idCer)
                var listItem = `
                    <li class="item" id="${certificate.certSerialNumber}">
                        <input type="radio" class="select" name="digital-certify" id="select${certificate.id}" checked>
                        <div class="icon">
                            <!-- Icon SVG của chứng chỉ -->
                        </div>
                        <div class="detail" id="${certificate.id}">
                            <h3 class="name">${certificate.name} - ${certificate.companyName}</h3>
                            <div class="digital-info">
                                <div class="digital-issued">
                                    <span>Issued by:</span>
                                    <span>${certificate.issued}</span>
                                </div>
                                <div class="digital-expried">
                                    <span>Expired:</span>
                                    <span>${certificate.expried}</span>
                                </div>
                            </div>
                        </div>
                        <a href="#" class="view">View Details</a>
                    </li>
                `;
                $('.digital-id').append(listItem);
            
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            // Xử lý khi có lỗi xảy ra
        }
    });

        //==========================End =========================================

        //==========================Begin ============================================================================================
        var canvas = document.getElementById('signatureCanvas');
        var context = canvas.getContext('2d');
        var isDrawing = false;
        var lastX = 0;
        var lastY = 0;
        var paths = JSON.parse(localStorage.getItem('savedPaths')) || [];
    
        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(paths[0].x, paths[0].y);
            for (var i = 1; i < paths.length; i++) {
                context.lineTo(paths[i].x, paths[i].y);
            }
            context.strokeStyle = '#000';
            context.lineWidth = 2;
            context.stroke();
        }
    
        function savePaths() {
            localStorage.setItem('savedPaths', JSON.stringify(paths));
        }
    
        canvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
    
        canvas.addEventListener('mousemove', function(e) {
            if (!isDrawing) return;
            var currentX = e.offsetX;
            var currentY = e.offsetY;
            paths.push({ x: currentX, y: currentY });
            draw();
            [lastX, lastY] = [currentX, currentY];
        });
    
        canvas.addEventListener('mouseup', function() {
            isDrawing = false;
            savePaths();
        });
    
        canvas.addEventListener('mouseout', function() {
            isDrawing = false;
            savePaths();
        });

        canvas.addEventListener('touchstart', function(e) {
            isDrawing = true;
            var touch = e.touches[0];
            [lastX, lastY] = [touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop];
        });
        
        canvas.addEventListener('touchmove', function(e) {
            if (!isDrawing) return;
            var touch = e.touches[0];
            var currentX = touch.clientX - canvas.offsetLeft;
            var currentY = touch.clientY - canvas.offsetTop;
            paths.push({ x: currentX, y: currentY });
            draw();
            [lastX, lastY] = [currentX, currentY];
        });
        
        canvas.addEventListener('touchend', function() {
            isDrawing = false;
            savePaths();
        });
        
        canvas.addEventListener('touchcancel', function() {
            isDrawing = false;
            savePaths();
        });
        
    
        $('#clearBtn').click(function(e) {
            e.preventDefault()
            context.clearRect(0, 0, canvas.width, canvas.height);
            paths = [];
            savePaths();
        });
    
        // $('#saveBtn').click(function() {
        //     signDraw()
        // });
    
        draw();

        function signDraw() {
            draw();
            var image = canvas.toDataURL('image/png');
            var link = document.createElement('a');
            link.download = 'signature.png';
            link.href = image;
            link.click();

            sendImage(image)
        }

        function signType() {

            var t = $('.input-type').val()
            console.log('in ra :'+t)

            var selectedDiv = $('.text-sign.select');
            var rect = selectedDiv[0].getBoundingClientRect();
    
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = rect.width;
            canvas.height = rect.height;
    
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
        
            context.fillStyle = 'black';
    
            html2canvas(selectedDiv[0], {
                onrendered: function(capturedCanvas) {
                    context.drawImage(capturedCanvas, 0, 0);
        
                    var imageDataUrl = canvas.toDataURL('image/png');
    
                    var link = document.createElement('a');
                    link.download = 'image_sign.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    sendImage(imageDataUrl)
                    
                }
            });
        }

        function sendImage(imageDataUrl) {
            // Convert base64 data URL to blob
            var byteCharacters = atob(imageDataUrl.split(',')[1]);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: 'image/png' });

            // Create FormData object and append the blob
            var formData = new FormData();
            formData.append('file', blob, 'image_sign.png');

            // Make a POST request to upload the image using Axios
            $.ajax({
                url: env_Url+'/api/v10/pdffile/upload-image',
                type: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('Image uploaded successfully:', response);
                    nameImageSign = response;
                    sendRequire()
                },
                error: function(xhr, status, error) {
                    console.error('Error uploading image:', error);
                }
            });
        }

        function uploadImage() {
            var fileInput = $('#file-upload')[0];
    
            if (fileInput.files.length > 0) {
                var formData = new FormData();
    
                for (var i = 0; i < fileInput.files.length; i++) {
                    formData.append('file', fileInput.files[i]);
                }
    
                $.ajax({
                    url: env_Url+ '/api/v10/pdffile/upload-image',
                    type: 'POST',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    },
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        console.log('Image uploaded successfully:', response);
                        nameImageSign = response;
                        sendRequire()
                    },
                    error: function(xhr, status, error) {
                        console.error('Error uploading image:', error);
                    }
                });
            } else {
                console.log('No file selected.');
            }
        }

        $('#btn-save').on('click' ,function(){
            
            $('.modal-draw').css('z-index', '-1');
            $('.modal-pass').show()
        })

    $('#btn-sign').on('click' ,function() {
       verifyPass()
    
    });
    
    function verifyPass() {
        var id = idCer; 
        var password = $('#text-pass').val(); 
        //console.log('Xac minh: '+id + "pass: "+ password)

        $.ajax({
            type: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            url: env_Url + '/api/v1/register-certificates/verify-password',
            data: {
                id: id,
                password: password
            },
            success: function(response) {
                // = true
                console.log('Pass đúng')
                $('.text-wrong').hide() 
                $('.text-lock').hide() 
                //if(verify == true) {

                    if(is_Status == 1) {
                        signType()
                    }
                    else if (is_Status == 2) {
                        signDraw()
                    }
                    else if(is_Status == 3){
                        uploadImage()
                    }
                    else {
                        sendRequire()
                    }
                //}
            
            },
            error: function(xhr, status, error) {
                
                if (xhr.status === 401) {
                     // Sai mật khẩu
                    $('.text-wrong').show() 
                    $('.text-lock').hide() 
                    var errorMessage = xhr.responseText; 
                    var parts = errorMessage.split(' '); 
                    var lastPart = parts[parts.length - 1]; 
                    var num = parseInt(lastPart); 
                    console.log('Số lần sai: ' + num);
                    $('.sai').text(num + '/3 lần')
                   
                } else if (xhr.status === 400) {
                    $('.text-wrong').hide() 
                    $('.text-lock').show()

                    //tai khoan bi khoa
                } else {
                    alert('Đã xảy ra lỗi: ' + error); 
                }
            }
        });
    }

    function sendRequire() {
        console.log(numDesign)
        var requestData = {
            nameInputFile: filePdf,
            nameImage: nameImageSign,
            keystorePassword: "123456",
            alias: idUser,
            reason: "ky hoa don",
            page: 1,
            x: 0,
            y: 0,
            numDesign: numDesign
        };

        axios.post(env_Url + '/api/v1/signDigital/signClient', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
                'ngrok-skip-browser-warning': 'true'
            },
        
        })
        .then(function (response) {
            $('.overlay').hide();
            $('.modal-sign').hide();
            $('.modal-draw').hide();
            $('.modal-design').hide();
            $('.modal-pass').hide()
            //console.log(requestData)
            //showAlertSuccess("thành công")
            console.log(response.data);
            localStorage.setItem('env_file', response.data);
            $('#pdfViewer').attr('src', env_Url+  '/images/' + response.data);
            
        })
        .catch(function (error) {
            console.error(error);
        });
    }


    // $('#upload-btn').click(function() {
    //     console.log('click up')
    //     uploadImage()
    // });

    

});

    //==========================End =========================================

    //==========================Begin =========================================

    $('#input-name').on('input', function(){

        var inputValue = $(this).val();
        $('.text-sign').text(inputValue);
    });

    $('.item').click(function(){
        event.preventDefault();

        $('.item').removeClass('active');
        console.log(is_Status)
        $(this).addClass('active');
    });

    $('.text-sign').click(function(){
        console.log('click')
        $('.text-sign').removeClass('select');

        $(this).addClass('select');
    });

    $('.img-sign').click(function(){
        console.log('click')
        $('.img-sign').removeClass('select');
        $(this).addClass('select');
        var sign_form_id = $(this).attr('id');
        console.log('Selected sign form ID:', sign_form_id);
        if (sign_form_id === 'sign-form1') {
            numDesign = 1;
        } else if (sign_form_id === 'sign-form2') {
            numDesign = 2;
        } else if (sign_form_id === 'sign-form3') {
            numDesign = 3;
        } else {
            numDesign = 4;
        }
        
    });


    var type = $('.box-type')
    var draw = $('.box-draw') 
    var upload = $('.box-upload')


    $('#type').on('click', function(){
        is_Status = 1;
        type.show()
        draw.hide()
        upload.hide()
    })

    $('#draw').on('click', function(){
        is_Status = 2;
        type.hide()
        draw.show()
        upload.hide()
    })

    $('#upload').on('click', function(){
        is_Status = 3;
        type.hide()
        draw.hide()
        upload.show()
    })

    $('.js-image').change(function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#signatureImg').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    });

    

    //==========================END =========================================

