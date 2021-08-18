function creategifo(params) {
    let btnStart = document.getElementById("comenzar");
    let btnRecorder = document.getElementById("grabar");
    let btnEnd = document.getElementById('finalizar');
    let btnSubmit = document.getElementById('subir')

}

function hideBtn() {
    document.getElementById('comenzar').style.display = 'none';
    document.getElementById('texto1').innerHTML = "¿Nos das acceso" + "<br />" + "a tu cámara?";
    document.getElementById('texto2').innerHTML = "El acceso a tu camara será válido sólo" + " <br / > " + "por el tiempo en el que estés creando el GIFO.";
    document.getElementById('num1').className = "num1";

}

function grabarBtn() {


}


function requestCamera() {

    //Mostrar pantalla acceso a camara
    hideBtn()

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        constrains = {
            video: {
                width: 1280,
                height: 720,
            },
            audio: false
        }
        navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
            let video = document.getElementById('video')
            video.srcObject = stream
            video.onloadedmetadata = (ev) => video.play()

            document.getElementById('contentGrab').style = "display: none;"
            document.getElementById('contentVideo').style = "display: block;"
                //Mostrar video de la camara

            console.log(stream)
        }).catch((err) => {
            console.log(err)
        })



    }
}