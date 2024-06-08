$(document).ready(function() {

    var is_Status = 0;
    var numDesign = 1;
    var idCer = 1;
    var env_Url = localStorage.getItem('env_url');
    $('#check-btn').click(function() {
        console.log('check')
        verifyPdf()

    })

    function verifyPdf(){
    
        var fileInput = $('#file-upload')[0].files[0]; 
        if (!fileInput) {
            alert('Vui lòng chọn file!');
            return;
        }
        var formData = new FormData();
        formData.append('file', fileInput);
            
        $.ajax({
            url:  env_Url + '/api/v1/signDigital/verify',
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            data: formData,
            contentType: false, 
            processData: false, 
            success: function(response) {
                $('.modal-check').show()
                $('.overlay').show()
                console.log("Response from server:", response);
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
        console.log('click')
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
        console.log('overlay-cer')
        $('.modal-viewcer').show()
        $('.overlaycer').show()
    })
})


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