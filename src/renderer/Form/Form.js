import React, { useState, useEffect } from 'react'
import '../styles/Form.css';
import Embed from '../Embed/embed.js' ;
import { ipcRenderer } from 'electron'

const Form = () => {
    const [ embed, setEmbed ] = useState({
        title: 'Debossed Glass Ashtray',
        url: 'https://www.supremecommunity.com/',
        description: '**Price:** £26 / $30\n**Category:** Accessories',
        thumbnail: {
          url: 'https://www.supremecommunity.com/u/season/spring-summer2020/accessories/6a2df187bf8047e3a4c5c27964a6b877_sqr.jpg'
        },
        fields: [],
        footer: {
            text: "Shihab",
            icon_url: "https://www.shihab.dev/ondemand.png"
        },
        color: "#2cb67d"
    });
    
    const [ info, setInfo ] = useState({"webhook": ""});

    useEffect(() => {
        ipcRenderer.on('title', (evt, arg) => {
            setEmbed(prevInfo => ({
                ...prevInfo,
                title: arg
            }))
        })
    })

    const updateFields = (e) => {
        let data = {};
        data[e.target.name] = e.target.value;
        setInfo(prevInfo => ({
            ...prevInfo,
            ...data
        }));
    }

    const updateEmbed = (e) => {
        let data = {};
        data[e.target.name] = e.target.value;
        console.log(e.target.name, e.target.value)
        setEmbed(prevInfo => ({
            ...prevInfo,
           ...data
        }))
    }

    const openWindow = () => {
        ipcRenderer.send('create', embed)
    }

    const addField = () => {
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: [...oldEmbed.fields, { name: "", value: "", inline: false, id: +new Date() }]
        }))
    }

    const updateField = (e) => {
        const id = e.currentTarget.parentNode.parentNode.id;
        let field = embed.fields.filter(field => { return field.id == id})[0];
        field[e.target.name] = e.target.value;
        let fieldsWithout = embed.fields.filter(field => {return field.id != id})
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: [...fieldsWithout, field]
        }))
    }

    const removeField = (e) => {
        const id = e.currentTarget.parentNode.parentNode.id;
        console.log(id)
        let fields = embed.fields;
        fields = fields.filter(field => { return field.id != id });
        console.log(fields);
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: fields
        }));
    }

    return (
        <div className="container">
                <div className="form">
                    <div className="form-item">
                        <div className="label">Webhook</div>
                        <input name="webhook" type="text" placeholder="13618273" value={info.webhook} onChange={updateFields}/>
                    </div>
                    <div className="form-item">
                        <div className="caption">Title</div>
                        <input name="title" type="text" value={embed.title} onChange={updateEmbed} />
                    </div>
                    <div className="form-item">
                        <div className="caption">Description</div>
                        <textarea name="description" onInput={updateEmbed} onPropertyChange={updateEmbed} value={embed.description} maxLength="2048"/>
                    </div>
                    {
                        embed.fields.map(field => {
                            return (
                                <div className="form-field">
                                    <div className="field" id={field.id}>
                                        <div className="field-inputs">
                                            <input type="text" name="name" value={field.name} className="field-input" onChange={updateField}/>
                                            <input type="text" name="value" value={field.value} className="field-input" onChange={updateField}/>
                                        </div>
                                        <div className="field-buttons">
                                            <button type="button" className="field-btn btn-add" onClick={addField}>+</button>
                                            <button type="button" className="field-btn btn-danger" onClick={removeField}>-</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="form-field">
                        <div className="caption">Description</div>
                        <input type="text" name="name" value={embed.footer.icon_url} className="field-input" onChange={updateField}/>
                        <input type="text" name="value" value={embed.footer.text} className="field-input" onChange={updateField}/>
                    </div>

                    <div className="form-item">
                        <div className="form-buttons" id="82183198237">
                            {
                                embed.fields.length == 0 && <button className="btn btn-add" onClick={addField}>Add Field</button>
                            }
                            <button className="btn btn-send" onClick={openWindow}>Send</button>
                        </div>
                    </div>
                </div>
                <div className="embed-container">
                    <div className="form-item">
                        <div className="caption">Preview</div>
                        <Embed {...embed} />
                    </div>
                </div>
            </div>
    )
}

export default Form;