
function upFile(){

    async function uploadFile(event) {

        const files = event.target.files;
        if(!files || files.length === 0) return;
    
        const formData = new FormData();
        formData.append('file',files[0]);
    
        try {
            const respone = await axios.post('http://localhost:8080/api/v10/pdf/upload', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log(respone.data);
            const pdfUrl = 'http://localhost:8080/images/'+ respone.data;
            
            if(respone.status === 200){
                window.location.href= 'signDigital.html?pdfUrl='+ encodeURIComponent(pdfUrl);
            }
        } catch (error) {
            console.log(error);
        }
    
        
    }
    
    const fileInput = document.getElementById('file-upload');
    fileInput.addEventListener('change', uploadFile);
    
}


$(document).ready(function() {
    var _PDF_DOC,
        _CURRENT_PAGE,
        _TOTAL_PAGES,
        _PAGE_RENDERING_IN_PROGRESS = 0,
        _CANVAS = $('#pdf-canvas')[0],
        _OVERLAY_CANVAS = $('#overlay-canvas')[0];
  
    async function showPDF(pdf_url) {
        //$('#pdf-loader').css('display', 'block');
  
        try {
            _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url });
        }
        catch(error) {
            alert(error.message);
        }
  
        _TOTAL_PAGES = _PDF_DOC.numPages;
        //$('#pdf-loader').css('display', 'none');
        //$('#pdf-contents').css('display', 'block');
        $('#pdf-total-pages').html(_TOTAL_PAGES);
        showPage(1);
    }
  
    async function showPage(page_no) {
        _PAGE_RENDERING_IN_PROGRESS = 1;
        _CURRENT_PAGE = page_no;
  
        $('#btn-next').prop('disabled', true);
        $('#btn-prev').prop('disabled', true);
  
        //$('#pdf-canvas').css('display', 'none');
        //$('#page-loader').css('display', 'block');
  
        $('#current_page').val(page_no);
        
        try {
            var page = await _PDF_DOC.getPage(page_no);
        }
        catch(error) {
            alert(error.message);
        }
  
        var pdf_original_width = page.getViewport(1).width;
        
        var scale_required = _CANVAS.width / pdf_original_width;
  
        var viewport = page.getViewport(scale_required);
  
        _CANVAS.height = viewport.height;
  
        //$('#page-loader').css('height', _CANVAS.height + 'px');
        //$('#page-loader').css('line-height', _CANVAS.height + 'px');
  
        var render_context = {
            canvasContext: _CANVAS.getContext('2d'),
            viewport: viewport
        };
            
        try {
            await page.render(render_context);
        }
        catch(error) {
            alert(error.message);
        }
  
        _PAGE_RENDERING_IN_PROGRESS = 0;
  
        $('#btn-next').prop('disabled', false);
        $('#btn-prev').prop('disabled', false);
  
        //$('#pdf-canvas').css('display', 'block');
        //$('#page-loader').css('display', 'none');
    }
  
   
  
    $('#btn-prev').click(function() {
        if(_CURRENT_PAGE != 1)
            showPage(--_CURRENT_PAGE);
    });
  
    $('#btn-next').click(function() {
        if(_CURRENT_PAGE != _TOTAL_PAGES)
            showPage(++_CURRENT_PAGE);
    });
  
    var _SIGNATURE_FRAME = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      page: 0
    };

    var pathFile = 'http://localhost:8080/images/20240304233254839.pdf';
  
    var _IS_DRAWING_SIGNATURE = false;
  
    $(_OVERLAY_CANVAS).on('mousedown', function(event) {
        var canvasRect = _OVERLAY_CANVAS.getBoundingClientRect();
        _IS_DRAWING_SIGNATURE = true;
    
        _SIGNATURE_FRAME.x = event.clientX - canvasRect.left;
        _SIGNATURE_FRAME.y =  event.clientY - canvasRect.top;

    });
  
    $(_OVERLAY_CANVAS).on('mousemove', function(event) {
      if (_IS_DRAWING_SIGNATURE) {
        var canvasRect = _OVERLAY_CANVAS.getBoundingClientRect();
        _SIGNATURE_FRAME.width = event.clientX - canvasRect.left - _SIGNATURE_FRAME.x;
        _SIGNATURE_FRAME.height = event.clientY - canvasRect.top - _SIGNATURE_FRAME.y;
  
        clearOverlayCanvas();
        drawSignatureFrame();
      }
    });
  
    $(_OVERLAY_CANVAS).on('mouseup', function() {
      _IS_DRAWING_SIGNATURE = false;
      saveSignatureFrame();
    });
  
    function clearOverlayCanvas() {
      var ctx = _OVERLAY_CANVAS.getContext('2d');
      ctx.clearRect(0, 0, _OVERLAY_CANVAS.width, _OVERLAY_CANVAS.height);
    }
  
    function drawSignatureFrame() {
      var ctx = _OVERLAY_CANVAS.getContext('2d');
      ctx.beginPath();
      ctx.rect(_SIGNATURE_FRAME.x, _SIGNATURE_FRAME.y, _SIGNATURE_FRAME.width, _SIGNATURE_FRAME.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  
    function saveSignatureFrame() {
      _SIGNATURE_FRAME.page = _CURRENT_PAGE;
      console.log("Signature Frame Coordinates and Size:", _SIGNATURE_FRAME);


    }

    const urlParams = new URLSearchParams(window.location.search);
    let pdfUrl = urlParams.get('pdfUrl');
    // if (!pdfUrl) {
    //     pdfUrl = 'http://localhost:8080/images/20240304233254839.pdf'; // Giá trị mặc định
    // }
    if (pdfUrl !=null){
        pathFile = pdfUrl;
        showPDF(pdfUrl);
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/register-certificates/active',
        method: 'GET',
        success: function(data) {
            data.forEach(function(certificate) {
                var listItem = `
                    <li class="digital-id__item" id="${certificate.certSerialNumber}">
                        <input type="radio" class="digital-id__select" name="digital-certify" id="digital-id__select${certificate.id}">
                        <div class="digital-id__icon">
                            <!-- Icon SVG của chứng chỉ -->
                        </div>
                        <div class="digital-id__detail" id="${certificate.id}">
                            <h3 class="digital-id__name">${certificate.name} - ${certificate.companyName}</h3>
                            <div class="digital-info">
                                <div class="digital-issued">
                                    <span>Issued by:</span>
                                    <span>${certificate.issued}</span>
                                </div>
                                <div class="digital-expried">
                                    <span>Expires:</span>
                                    <span>${certificate.expried}</span>
                                </div>
                            </div>
                        </div>
                        <a href="#" class="digital-id__view">View Details</a>
                    </li>
                `;
                $('.digital-id').append(listItem);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            // Xử lý khi có lỗi xảy ra
        }
    });

    
    $('.digital-id').on('click', '.digital-id__select', function() {
        $('#btn-continue').prop('disabled', false);
    });


    // Bắt sự kiện click cho nút "View Details"
    $('.digital-id').on('click', '.digital-id__view', function() {

        var itemId = $(this).closest('.digital-id__item').attr('id');
        var detailId = $(this).siblings('.digital-id__detail').attr('id');

        // In ra ID lấy được
        console.log('Item ID:', itemId);
        console.log('Detail ID:', detailId);

        $.ajax({
            url: 'http://localhost:8080/api/v1/register-certificates/'+ detailId,
            method: 'GET',
            success: function(data) {

                $('.edit-form input[name="username"]').val(data.name);
                $('.edit-form input[name="id"]').val(data.id);
                $('.edit-form input[name="email"]').val(data.email);
                $('.edit-form input[name="date"]').val(data.date_register);
                $('.edit-form input[name="phone"]').val(data.phone);
                $('.edit-form input[name="company"]').val(data.companyName);
                $('.edit-form input[name="change-status"]').val(data.status);
                $('.edit-form input[name="expried"]').val(data.expried);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });


    $('.digital-id').on('click', '.digital-id__select', function() {

        var itemId = $(this).closest('.digital-id__item').attr('id'); // id numCertificate
        var detailId = $(this).siblings('.digital-id__detail').attr('id'); // id chính

        //alias
        console.log('Item ID:', itemId);
        // x, y, page
      
        console.log("Signature Frame Coordinates and Size:", _SIGNATURE_FRAME);
        var splitfile = pathFile.split('/')
       // var pathFile = 'http://localhost:8080/images/20240304233254839.pdf';
        console.log(splitfile[splitfile.length -1])
        //name 
        var namefile = splitfile[splitfile.length -1];
        var reason= "";
        $('#btn-reason-continue').click(function(e){
            e.preventDefault()
            //reason
            reason = $('#text-reason').val()
            console.log(reason)

            $('#text-lock').hide()
            $('.wrong').hide()
        });
        
        $('#verify-btn').click(function(e) {
            e.preventDefault()
            var id = detailId; 
            var password = $('#text-pass').val(); 
            console.log('Xac minh: '+itemId + "pass: "+ password)
            var cnt =0;
            console.log("Signature Frame Coordinates and Size:", _SIGNATURE_FRAME);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/v1/register-certificates/verify-password',
                data: {
                    id: id,
                    password: password
                },
                success: function(response) {
                    $('#text-lock').hide()
                    $('.wrong').hide()
                    console.log('ok')
                    //Send request 

                    var pdfWidth = 595; 
                    var pdfHeight = 842; 

                    // Tỉ lệ chuyển đổi từ tọa độ giao diện sang tọa độ PDF
                    var scaleX = pdfWidth / 854;
                    var scaleY = pdfHeight / 1105; 

                    var pdfX = _SIGNATURE_FRAME.x * scaleX;
                    var pdfY = pdfHeight - _SIGNATURE_FRAME.y * scaleY;

                    var requestData = {
                        nameInputFile: namefile,
                        keystorePassword: password,
                        alias: itemId,
                        reason: reason,
                        page: _SIGNATURE_FRAME.page,
                        x: pdfX,
                        y: pdfY
                    };

                    console.log(requestData)
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8080/api/v1/signDigital/sign',
                        contentType: 'application/json',
                        data: JSON.stringify(requestData),
                        success: function(respone) {
                            console.log('Server response:', response);
                        },
                        error: function(xhr, status, error){
                            console.error('Server error:', error);
                        }

                    })
                },
                error: function(xhr, status, error) {
                    
                    if (xhr.status === 401) {
                         // Sai mật khẩu
                         
                        var errorMessage = xhr.responseText; 
                        var parts = errorMessage.split(' '); 
                        var lastPart = parts[parts.length - 1]; 
                        var num = parseInt(lastPart); 
                        console.log('Số lần sai: ' + num);
                        $('.wrong').show() 
                        $('#num-wrong').text(num)  
                    } else if (xhr.status === 400) {
                        $('.wrong').hide() 

                        $('#text-lock').show()
                        //tai khoan bi khoa
                    } else {
                        alert('Đã xảy ra lỗi: ' + error); 
                    }
                }
            });
        });
        
    });
    
  });