import React, { useEffect, useRef, useState } from "react"
import "./qr.css";
import QRCodeStyling from "qr-code-styling";

//styles
import Button from 'react-bootstrap/Button'


const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Iredoc2.svg",
    dotsOptions: {
        color: "#0b5793",
        type: "rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 5
    }
});


export default function QrCode(props) {
    const [url, setUrl] = useState(props.data);
    const fileExt = "png"
    const ref = useRef(null);
    const acceptedEmail = require("crypto-js");
    let [finalEmail, setFinalEmail] = useState("");


    useEffect(() => {
        let qrdata = props.data["name"] + " " + props.data["midName"][0].toUpperCase() + "." + " [|] " + props.data["studentNum"] + " [|] " + props.data["guild"] + " [|] " + props.data["section"]
        setFinalEmail(acceptedEmail.AES.encrypt(qrdata, '@stamaria.sti.edu.ph').toString());
        // eslint-disable-next-line
    }, [props.data]);

    useEffect(() => {
        setUrl(finalEmail);
        qrCode.append(ref.current);
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        }, [finalEmail]);

    useEffect(() => {
        let name = props.data["name"];
        let section = props.data["section"];

        qrCode.getRawData("png")
            .then(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    let b64 = reader.result;

                    const requestOptions = {
                        mode: 'no-cors',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: { name },
                            section: { section },
                            qrcode: { b64 }
                        })
                    };

                    fetch('https://lista.deta.dev/api', requestOptions)
                        .then(response => response.json())
                        .then(data => this.setState({ postId: data.id }));
                }
            });
    }, [ref]);

    useEffect(() => {
        qrCode.update({
            data: url
        });

        console.log(url);
    }, [url]);

    const onDownloadClick = () => {
        qrCode.download({
            extension: fileExt
        });
    };



    return (
        <div className="QR-section">
            <div style={styles.QRsection} ref={ref} />
            <Button style={styles.dwnloadBtn} variant="primary" onClick={onDownloadClick}>Download</Button>
        </div>
    );
}

const styles = {
    dwnloadBtn: {
        marginTop: '50px',
        width: '100%'
    },

    QRsection: {
        marginTop: '50vh'
    }
};

