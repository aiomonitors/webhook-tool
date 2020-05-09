import React, { useState, useEffect } from 'react'
import '../styles/InputPage.scss';
import { ipcRenderer } from 'electron';
const InputPage = () => {
    const [embed, setEmbed] = useState("");

    useEffect(() => {
        ipcRenderer.on('embed', (evt, emb) => {
            console.log(emb)
            setEmbed(JSON.stringify(emb, null, 3))
        })
    }, [])

    return (
        <div className="input-page-container">
            <div className="heading">Input Embed</div>
            {embed}
        </div>
    )
}

export default InputPage;