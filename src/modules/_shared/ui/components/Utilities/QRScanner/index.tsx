import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import * as ScreenOrientation from 'expo-screen-orientation';

const qrcodeRegionId = 'html5qr-code-full-region';

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

function scannerTranslator() {
    const traducciones = [
        // Html5QrcodeStrings
        { original: 'QR code parse error, error =', traduccion: 'Error al analizar el código QR, error =' },
        { original: 'Error getting userMedia, error =', traduccion: 'Error al obtener userMedia, error =' },
        {
            original: 'The device doesn\'t support navigator.mediaDevices , only supported cameraIdOrConfig in this case is deviceId parameter (string).',
            traduccion: 'El dispositivo no admite navigator.mediaDevices, en este caso sólo se admite cameraIdOrConfig como parámetro deviceId (cadena).'
        },
        {
            original: 'Camera streaming not supported by the browser.',
            traduccion: 'El navegador no admite la transmisión de la cámara.'
        },
        {
            original: 'Unable to query supported devices, unknown error.',
            traduccion: 'No se puede consultar los dispositivos compatibles, error desconocido.'
        },
        {
            original: 'Camera access is only supported in secure context like https or localhost.',
            traduccion: 'El acceso a la cámara sólo es compatible en un contexto seguro como https o localhost.'
        },
        { original: 'Scanner paused', traduccion: 'Escáner en pausa' },

        // Html5QrcodeScannerStrings
        { original: 'Scanning', traduccion: 'Escaneando' },
        { original: 'Idle', traduccion: 'Inactivo' },
        { original: 'Error', traduccion: 'Error' },
        { original: 'Permission', traduccion: 'Permiso' },
        { original: 'No Cameras', traduccion: 'Sin cámaras' },
        { original: 'Last Match:', traduccion: 'Última coincidencia:' },
        { original: 'Code Scanner', traduccion: 'Escáner de código' },
        { original: 'Request Camera Permissions', traduccion: 'Solicitar permisos de cámara' },
        { original: 'Requesting camera permissions...', traduccion: 'Solicitando permisos de cámara...' },
        { original: 'No camera found', traduccion: 'No se encontró ninguna cámara' },
        { original: 'Stop Scanning', traduccion: 'Detener escaneo' },
        { original: 'Start Scanning', traduccion: 'Iniciar escaneo' },
        { original: 'Switch On Torch', traduccion: 'Encender linterna' },
        { original: 'Switch Off Torch', traduccion: 'Apagar linterna' },
        { original: 'Failed to turn on torch', traduccion: 'Error al encender la linterna' },
        { original: 'Failed to turn off torch', traduccion: 'Error al apagar la linterna' },
        { original: 'Launching Camera...', traduccion: 'Iniciando cámara...' },
        { original: 'Scan an Image File', traduccion: 'Escanear un archivo de imagen' },
        { original: 'Scan using camera directly', traduccion: 'Escanear usando la cámara directamente' },
        { original: 'Select Camera', traduccion: 'Seleccionar cámara' },
        { original: 'Choose Image', traduccion: 'Elegir imagen' },
        { original: 'Choose Another', traduccion: 'Elegir otra' },
        { original: 'No image choosen', traduccion: 'Ninguna imagen seleccionada' },
        { original: 'Anonymous Camera', traduccion: 'Cámara anónima' },
        { original: 'Or drop an image to scan', traduccion: 'O arrastra una imagen para escanear' },
        {
            original: 'Or drop an image to scan (other files not supported)',
            traduccion: 'O arrastra una imagen para escanear (otros archivos no soportados)'
        },
        { original: 'zoom', traduccion: 'zoom' },
        { original: 'Loading image...', traduccion: 'Cargando imagen...' },
        { original: 'Camera based scan', traduccion: 'Escaneo basado en cámara' },
        { original: 'Fule based scan', traduccion: 'Escaneo basado en archivo' },

        // LibraryInfoStrings
        { original: 'Powered by ', traduccion: 'Desarrollado por ' },
        { original: 'Report issues', traduccion: 'Informar de problemas' },

        // Others
        { original: 'NotAllowedError: Permission denied', traduccion: 'Permiso denegado para acceder a la cámara' }
    ];

    // Función para traducir un texto
    function traducirTexto(texto) {
        const traduccion = traducciones.find(t => t.original === texto);
        return traduccion ? traduccion.traduccion : texto;
    }

    // Función para traducir los nodos de texto
    function traducirNodosDeTexto(nodo) {
        if (nodo.nodeType === Node.TEXT_NODE) {
            nodo.textContent = traducirTexto(nodo.textContent.trim());
        } else {
            for (let i = 0; i < nodo.childNodes.length; i++) {
                traducirNodosDeTexto(nodo.childNodes[i]);
            }
        }
    }

    // Crear el MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((nodo) => {
                    traducirNodosDeTexto(nodo);
                });
            }
        });
    });

    // Configurar y ejecutar el observer
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Traducir el contenido inicial
    traducirNodosDeTexto(document.body);
}


export default function QRScanner({
    orientation,
    onScanned,
    size,
    onError
}: { orientation: boolean; onScanned: any, size: number, onError: any }) {


    const html5QrcodeScanner = useRef();

    useEffect(() => {
        // when component mounts
        initialize(orientation);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.current?.clear?.().catch(error => {
                console.error('Failed to clear html5QrcodeScanner. ', error);
            });
        };
    }, []);

    function initialize(orientation) {

        const verbose = false;
        // Suceess callback is required.
        if (!(onScanned)) {
            throw 'qrCodeSuccessCallback is required callback.';
        }

        html5QrcodeScanner.current = new Html5QrcodeScanner(qrcodeRegionId, {
            disableFlip: false,
            /*   rememberLastUsedCamera: true,*/
            videoConstraints: {
                aspectRatio: orientation == 'LANDSCAPE' ? 1 / 0.5 : 1 / 2
                /*width: size * 2,*/
            },
            qrbox: {
                width: size,
                height: size
            },
            fps: 10

        }, verbose);

        html5QrcodeScanner.current.render(onScanned, onError);
        scannerTranslator(document.querySelector('#' + qrcodeRegionId));
    }


    return (
            <div id={qrcodeRegionId} />
    );
}

export function useHandleOrientation() {
    const [orientation, setOrientation] = useState(null);

    useEffect(() => {
        checkOrientation();
        const subscription = ScreenOrientation.addOrientationChangeListener(
                handleOrientationChange
        );

        return () => {
            ScreenOrientation.removeOrientationChangeListeners(subscription);
        };
    }, []);

    const checkOrientation = async () => {
        const orientation = await ScreenOrientation.getOrientationAsync();
        setOrientation(orientation);
    };
    const handleOrientationChange = (o) => {
        setOrientation(o.orientationInfo.orientation);
    };


    return {
        orientation: [0, 1, 2].includes(orientation) ? 'PORTRAIT' : 'LANDSCAPE'
    };
}

export function useScanner() {
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    return {
        scannedData,
        showScanner,
        setScannedData,
        setShowScanner
    };
}