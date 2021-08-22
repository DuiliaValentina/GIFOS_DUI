var globalStream
var recorder

function creategifo(params) {
    let btnStart = document.getElementById("comenzar");
    let btnRecorder = document.getElementById("grabar");
    let btnEnd = document.getElementById('finalizar');
    let btnSubmit = document.getElementById('subir')

}

function hideBtn() {
    document.getElementById('comenzar').style.display = 'none';
    document.getElementById('texto1').innerHTML = "¿Nos das acceso" + "<br />" + "a tu cámara";
    document.getElementById('texto2').innerHTML = "El acceso a tu camara será válido sólo" + " <br / > " + "por el tiempo en el que estés creando el GIFO.";
    paintNumbers(1);
    //document.getElementById('num1').className = "num1";

}

function paintNumbers(number) {
    let num1 = document.getElementById("num1");
    let num2 = document.getElementById("num2");
    let num3 = document.getElementById("num3");

    num1.className = "num";
    num2.className = "num";
    num3.className = "num";

    if (number == 1) {
        num1.className = "num1";
    } else if (number == 2) {
        num2.className = "num1"
    } else if (number == 3) {
        num3.className = "num1"
    } else {
        console.error("No se puede completar la operacion");
    }

}

function requestCamera() {

    //Mostrar pantalla acceso a camara
    hideBtn()

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Ya sabemos que el dispositivo tiene una camara disponible

        constrains = {
            video: {
                width: 1280,
                height: 720,
            },
            audio: false,
            mimeType: 'video/webm'
        }

        navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
            // Ya tenemos acceso a la camara del dispositivo
            globalStream = stream
            let video = document.getElementById('video')
            video.srcObject = stream
            video.onloadedmetadata = (ev) => video.play()

            document.getElementById('grabar').style = "display: block"

            document.getElementById('contentGrab').style = "display: none;"
            document.getElementById('contentVideo').style = "display: block;"

            console.log(stream)
            paintNumbers(2);

        }).catch((err) => {
            console.log(err)
        })
    }



}

function grabarBtn() {
    let gifRecorded

    recorder = RecordRTC(globalStream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('started')
        },
    });
    recorder.startRecording();
    document.getElementById('grabar').style = "display: none"
    document.getElementById('finalizar').style = "display: block"
}

function finalizarBtn() {
    recorder.stopRecording(function() {
        gifRecorded = recorder.getBlob();

        var file = new File([gifRecorded], {
            type: 'gif'
        });
        document.getElementById("video").style = "display:none"
        var myGifo = document.createElement("img")
        myGifo.id = "myGifo";
        myGifo.className = "myGifo";
        myGifo.src = window.URL.createObjectURL(gifRecorded);
        myGifo.style = "display:block";
        document.getElementById("contentVideo").appendChild(myGifo);


        /* let video = document.getElementById('video');
        video.srcObject = null
        video.src = window.URL.createObjectURL(gifRecorded); */
    });



}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}