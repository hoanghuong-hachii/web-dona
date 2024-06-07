var is_Status = 0;
var nameImageSign = '20240507232203812.png'
var numDesign = 1;
var idCer = 1;
var env_Url = localStorage.getItem('env_url');


$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    const idInvoice = urlParams.get('idInvoice');

    if(fileParam) {
        var filePdf = localStorage.setItem('env_file', fileParam);
    }
    var filePdf = localStorage.getItem('env_file');
    if (filePdf) {
        $('#pdfViewer').attr('src', env_Url+ '/images/' + filePdf);
    } else {
        console.error('File parameter not found.');
    }

    var currentTime = Date.now();
 
    console.log(fileParam);

    console.log(idInvoice)
    function formatDate(date) {
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        return day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    }

    //==========index.js====================================================================================================================
    const $pdf = env_Url+ '/images/' + filePdf;

    const $initialState = {
        pdfDoc: null,
        currentPage: 1,
        pageCount: 0,
        zoom: 1,
    };

    const renderPage = () => {

        $initialState.pdfDoc.getPage($initialState.currentPage).then((page) => {
            console.log('page', page);

            const canvas = $('#canvas')[0];
            const $ctx = canvas.getContext('2d');
            const $viewport = page.getViewport({ scale: $initialState.zoom });

            canvas.height = $viewport.height;
            canvas.width = $viewport.width;

            const renderCtx = {
            canvasContext: $ctx,
            viewport: $viewport,
            };

            page.render(renderCtx);

            $('#page_num').html($initialState.currentPage);
        });
    };

    const headers = {
        'ngrok-skip-browser-warning': 'true'
    };

    pdfjsLib.getDocument({
        url: $pdf,
        httpHeaders: headers 
        }).promise.then((doc) => {
        $initialState.pdfDoc = doc;
        console.log('pdfDocument', $initialState.pdfDoc);

        $('#page_count').html($initialState.pdfDoc.numPages);

        renderPage();
        })
        .catch((err) => {
        alert(err.message);
    });

    function showPrevPage() {
        if ($initialState.pdfDoc === null || $initialState.currentPage <= 1) return;
        $initialState.currentPage--;
        $('#current_page').val($initialState.currentPage);
        renderPage();
    }

    function showNextPage() {
        if (
            $initialState.pdfDoc === null ||
            $initialState.currentPage >= $initialState.pdfDoc._pdfInfo.numPages
        )
            return;

        $initialState.currentPage++;
        $('#current_page').val($initialState.currentPage);
        renderPage();
    }

    $('#fullButton').on('click', function() {
        filePdf = localStorage.getItem('env_file');
        var urlNew = env_Url + '/images/' + filePdf;
        window.open(urlNew, '_blank');
    })

    $('#prev-page').click(showPrevPage);
    $('#next-page').click(showNextPage);

    $('#current_page').on('keypress', (event) => {
        if ($initialState.pdfDoc === null) return;
        const $keycode = event.keyCode ? event.keyCode : event.which;
        if ($keycode === 13) {
            let desiredPage = $('#current_page')[0].valueAsNumber;

            $initialState.currentPage = Math.min(
            Math.max(desiredPage, 1),
            $initialState.pdfDoc._pdfInfo.numPages
            );
            renderPage();

            $('#current_page').val($initialState.currentPage);
        }
    });

    $('#zoom_in').on('click', () => {
        if ($initialState.pdfDoc === null) return;
        $initialState.zoom *= 4 / 3;

        renderPage();
    });

    $('#zoom_out').on('click', () => {
        if ($initialState.pdfDoc === null) return;
        $initialState.zoom *= 2 / 3;
        renderPage();
    });


    //============================================================================================================================================================================

    
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
        let currentDateTime = new Date();
        let formattedDateTime = formatDate(currentDateTime);
        $("#date-time").text(formattedDateTime);
        verifyPdf();
    })

    $('.sign-btn').on('click', function() {
        $('.overlay').show()
        $('.modal-sign').show()
    })

    $('#downloadButton').click(function(){
        console.log('download')
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

    function verifyPdf(){
        var pdfname= localStorage.getItem('env_file')
        var requestData = {
            pdfname: pdfname
        };
        $.ajax({
            url:  env_Url + '/api/v1/signDigital/verifySrc',
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            data: requestData,
            success: function(response) {
                //console.log("Response from server:", response);
                console.log('length: '+response.length)
                var rev1 = response[0];
               
                console.log(rev1)
                var len =response.length;
                if(len>1){
                    var rev2 = response[1];
                    $('#info-sign-rev2').show()
                    setRev1(rev1,len)
                    setRev2(rev2,len)


                } else {
                    $('#info-sign-rev2').hide()
                    setRev1(rev1,len)
                }

                
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                // Xử lý khi có lỗi xảy ra
            }
        });
    }

    function checkSign() {
        $('.check-sign1').show()
        $('.uncheck-sign1').hide()
    }

    function uncheckSign() {
        $('.check-sign1').hide()
        $('.uncheck-sign1').show()
    }

    
    function checkSign2() {
        $('.check-sign2').show()
        $('.uncheck-sign2').hide()
    }

    function uncheckSign2() {
        $('.check-sign2').hide()
        $('.uncheck-sign2').show()
    }

    function setRev1(rev1, len) {
        //$('.info-sign-rev1').text()
        var checksign1 = true;
        $('.name-sign1').text("Rev.1: Được ký bởi "+ rev1.subject)
        if(rev1.integrityCheck == true){
            $('.signature-sign1-iconcheck').show()
            $('.signature-sign1-iconuncheck').hide()
            $('.signature-sign1').text("Chữ ký số hợp lệ")
        } else {
            $('.signature-sign1-iconcheck').hide()
            $('.signature-sign1-iconuncheck').show()
            $('.signature-sign1').text("Chữ ký số không hợp lệ")
            checksign1 = false;
        }

        if(rev1.coversWholeDocument == true){
            $('.info-sign1-iconcheck').show()
            $('.info-sign1-iconuncheck').hide()
            $('.info-sign1').text("Tài liệu không bị thay đổi kể từ khi được ký")
        } else {
            if(rev1.totalRevisions > len){
                checksign1 = false;
                $('.info-sign1-iconcheck').hide()
                $('.info-sign1-iconuncheck').show()
                $('.info-sign1').text("Tài liệu đã bị thay đổi sau khi được ký")
            } else {
                $('.info-sign1-iconcheck').show()
                $('.info-sign1-iconuncheck').hide()
                $('.info-sign1').text("Phiên bản của tài liệu được bảo vệ bởi chữ ký này không bị thay đổi")
            }
        }
        //===========
        
        $('.time-sign1').text('Thời gian ký: '+rev1.signDate)
        $('.rev1-name').text(rev1.subject)

        $('#rev1-time').text(rev1.signDate)
        $('#rev1-reason').text(rev1.reason)
        $('#rev1-location').text(rev1.location)
        if(rev1.fillInAllowed == true && rev1.annotationsAllowed == true) {
            $('#rev1-allow').text("Signing, Form filling, Commenting")
        } else if(rev1.fillInAllowed == true && rev1.annotationsAllowed == false) {
            $('#rev1-allow').text("Signing, Form filling")
        } else if(rev1.fillInAllowed == false && rev1.annotationsAllowed == false) {
            $('#rev1-allow').text("Read only")
        }
        //certificate
            
        var data = rev1.certificates[0]
        var rev1cer = {};
        rev1cer =  certificesInfo(data)
        $('#rev1-version').text(rev1cer.Version)
        $('#rev1-sign-althm').text(rev1cer.Signature_Algorithm)
        $('#rev1-subject').text(rev1cer.SubjectDN)
        $('#rev1-serial').text(rev1cer.SerialNumber)
        $('#rev1-datestart').text(rev1cer.Start_Date)
        $('#rev1-dateend').text(rev1cer.Final_Date)
        $('#rev1-public-key').text(rev1cer.modulus)
        $('#rev1-signature').text(rev1cer.Signature)

        
        if(checksign1 == true){
            checkSign()
        } else {
            uncheckSign()
        }
    }

    $('.modal-viewcer .grid-item.ok').click(function() {
        $('.modal-viewcer .grid-item').removeClass('active-cer')
        $(this).toggleClass('active-cer');
        var res = $(this).text()
        $('.rev1-field').text(res)

    });
    function certificesInfo(data) {

            var lines = data.split('\n');
            var result = {};
            var currentKey = '';
            var currentValue = '';

            $.each(lines, function(index, line) {
                var trimmedLine = line.trim();
                var keyValue = trimmedLine.match(/^([^:]+):\s*(.*)$/);

                if (keyValue) {
                    if (currentKey) {
                        result[currentKey] = currentValue.trim();
                    }
                    currentKey = keyValue[1].trim();
                    currentValue = keyValue[2].trim();
                } else {
                    currentValue += ' ' + trimmedLine;
                }
            });

            if (currentKey) {
                result[currentKey] = currentValue.trim();
            }

            var rev1cer = {};
            $.each(result, function(key, value) {
                rev1cer[key.replace(/\s+/g, '_')] = value;
            });
            return rev1cer
    }
    
    function setRev2(rev1, len) {
        //$('.info-sign-rev1').text()
        var checksign1 = true;
        $('.name-sign2').text("Rev.2: Được ký bởi "+ rev1.subject)
        if(rev1.integrityCheck == true){
            $('.signature-sign2-iconcheck').show()
            $('.signature-sign2-iconuncheck').hide()
            $('.signature-sign2').text("Chữ ký số hợp lệ")
        } else {
            $('.signature-sign2-iconcheck').hide()
            $('.signature-sign2-iconuncheck').show()
            $('.signature-sign2').text("Chữ ký số không hợp lệ")
            checksign1 = false;
        }

        if(rev1.coversWholeDocument == true){
            $('.info-sign2-iconcheck').show()
            $('.info-sign2-iconuncheck').hide()
            $('.info-sign2').text("Tài liệu không bị thay đổi kể từ khi được ký")
        } else {
            if(rev1.totalRevisions > len){
                checksign1 = false;
                $('.info-sign2-iconcheck').hide()
                $('.info-sign2-iconuncheck').show()
                $('.info-sign2').text("Tài liệu đã bị thay đổi sau khi được ký")
            } else {
                $('.info-sign2-iconcheck').show()
                $('.info-sign2-iconuncheck').hide()
                $('.info-sign2').text("Phiên bản của tài liệu được bảo vệ bởi chữ ký này không bị thay đổi")
            }
        }
        
        $('.time-sign2').text('Thời gian ký: '+rev1.signDate)
        //===========
        $('.rev2-name').text(rev1.subject)

        $('#rev2-time').text(rev1.signDate)
        $('#rev2-reason').text(rev1.reason)
        $('#rev2-location').text(rev1.location)
        if(rev1.fillInAllowed == true && rev1.annotationsAllowed == true) {
            $('#rev2-allow').text("Signing, Form filling, Commenting")
        } else if(rev1.fillInAllowed == true && rev1.annotationsAllowed == false) {
            $('#rev2-allow').text("Signing, Form filling")
        } else if(rev1.fillInAllowed == false && rev1.annotationsAllowed == false) {
            $('#rev2-allow').text("Read only")
        }
        //certificate
            
        var data = rev1.certificates[0]
        var rev1cer = {};
        rev1cer =  certificesInfo(data)
        $('#rev2-version').text(rev1cer.Version)
        $('#rev2-sign-althm').text(rev1cer.Signature_Algorithm)
        $('#rev2-subject').text(rev1cer.SubjectDN)
        $('#rev2-serial').text(rev1cer.SerialNumber)
        $('#rev2-datestart').text(rev1cer.Start_Date)
        $('#rev2-dateend').text(rev1cer.Final_Date)
        $('#rev2-public-key').text(rev1cer.modulus)
        $('#rev2-signature').text(rev1cer.Signature)

        if(checksign1 == true){
            checkSign2()
        } else {
            uncheckSign2()
        }
    }

    $('.close1').click(function(){
        $('.modal-viewsign').hide()
        $('.overlay2').hide()
    })

    $('.close2').click(function(){
        $('.modal-viewcer').hide()
        $('.overlaycer').hide()
    })
    $('.show-sign1').click(function(){
        $('.modal-viewsign').show()
        $('.container.sign1').show()
        $('.container.sign2').hide()

        $('.overlay2').show()
    })

    $('.show-sign2').click(function(){
        $('.modal-viewsign').show()
        $('.container.sign1').hide()
        $('.container.sign2').show()
        $('.overlay2').show()
    })
    $('.rev1-view').click(function(){
        $('.modal-viewcer').show()
        $('.overlaycer').show()
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
        var paths = JSON.parse(localStorage.getItem('savedPaths')) || [];

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
                y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
            };
        }

        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = '#000';
            context.lineWidth = 2;

            paths.forEach(path => {
                context.beginPath();
                if (path.length > 0) {
                    context.moveTo(path[0].x, path[0].y);
                    for (var i = 1; i < path.length; i++) {
                        context.lineTo(path[i].x, path[i].y);
                    }
                }
                context.stroke();
            });
        }

        function savePaths() {
            localStorage.setItem('savedPaths', JSON.stringify(paths));
        }

        canvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            var pos = getMousePos(canvas, e);
            paths.push([{ x: pos.x, y: pos.y }]);
        });

        canvas.addEventListener('mousemove', function(e) {
            if (!isDrawing) return;
            var pos = getMousePos(canvas, e);
            paths[paths.length - 1].push({ x: pos.x, y: pos.y });
            draw();
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
            if (e.target === canvas) {
                e.preventDefault();
            }
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        canvas.addEventListener('touchend', function(e) {
            if (e.target === canvas) {
                e.preventDefault();
            }
            var mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        canvas.addEventListener('touchmove', function(e) {
            if (e.target === canvas) {
                e.preventDefault();
            }
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        //===========================

        document.getElementById('clearBtn').addEventListener('click', function(e) {
            e.preventDefault();
            context.clearRect(0, 0, canvas.width, canvas.height);
            paths = [];
            savePaths();
        });

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
        console.log('nameImageSign: '+nameImageSign)
        var requestData = {
            nameInputFile: filePdf,
            nameImage: nameImageSign,
            keystorePassword: "123456",
            alias: idUser,
            reason: "ky hoa don",
            page: 1,
            x: 0,
            y: 0,
            numDesign: numDesign,
            uuid: idInvoice
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
            alert('Ký file thành công')
            console.log(response.data);
            localStorage.setItem('env_file', response.data);
            $('.pdfViewer').attr('src', env_Url+  '/images/' + response.data);
            
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

