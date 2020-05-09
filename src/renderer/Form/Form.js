import React, { useState, useEffect } from 'react'
import '../styles/Form.css';
import Embed from '../Embed/embed.js' ;
import { ipcRenderer } from 'electron';
const axios = require('axios');

const Form = () => {
    const [ embed, setEmbed ] = useState({"title":"Ballpark™ Poncho","url":"https://www.supremecommunity.com/season/spring-summer2020/droplist/2020-04-30/","description":"Polyethylene rain poncho with adjustable hood and printed logo on chest.","fields":[{"name":"Category","value":"Accessories","inline":true},{"name":"Price","value":"£3 / $4","inline":true},{"name":"Upvotes / Downvotes","value":"15215 / 671","inline":true}],"thumbnail":{"url":"https://www.supremecommunity.com/u/season/spring-summer2020/accessories/01e6c4d7ac6047a9aeaa44078685d235_sqr.jpg"},color: "#2cb67d", "footer":{"text":"Powered by OnDemand • @AIOMonito","icon_url":"https://www.shihab.dev/ondemand.png"}});
    const [ webhook, setWebhook ] = useState("")
    
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
        ipcRenderer.send('prompt-input', embed)
    }

    const addField = () => {
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: [...oldEmbed.fields, { "inline": true, "name": "", "value": "", id: +new Date()*1387216 }]
        }))
    }

    const updateField = (e) => {
        const id = e.currentTarget.parentNode.parentNode.id;
        let updated = embed.fields.filter(field => { return field.id == id})[0];
        updated[e.target.name] = e.target.value;
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: oldEmbed.fields.map(field => { return field.id == id ? updated : field})
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
            fields: oldEmbed.fields.filter(field => { return field.id != id })
        }));
    }
    //https://discordapp.com/api/webhooks/696119796072317009/nKJz5XNMBN2DVm6Hy69f2WNWMiCfTPAAS6eTuXEbXTu6LbfACfYP5lDMUG6D123jdEQx
    //
    const updateFooter = (e) => {
        let data = {};
        data[e.target.name] = e.target.value;
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            footer: {
                ...oldEmbed.footer,
                ...data
            }
        }));
    }

    const sendHook = async () => {
        try {
            let emb = embed;
            emb.color = emb.color ? parseInt(`0x${embed.color.replace("#", "")}`) : null;
            let res = await axios.post(webhook, {
                content : null,
                embeds : [emb]
            });
            console.log(emb)
            return true
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container" data-aos="fade-in" data-aos-duration="1500">
                <div className="form">
                    <div className="form-item">
                        <div className="label">Webhook</div>
                        <input name="webhook" type="text" className="regular-input" placeholder="13618273" value={webhook} onChange={e => {setWebhook(e.target.value)}}/>
                    </div>
                    <div className="form-item">
                        <div className="caption">Title</div>
                        <input name="title" type="text" className="regular-input" value={embed.title} onChange={updateEmbed} />
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
                                            <input type="checkbox" id={`toggle-${field.id}`} class="offscreen" /> <label for={`toggle-${field.id}`} class="switch"></label>
                                            <button type="button" className="field-btn btn-danger" onClick={removeField}>-</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="form-item">
                        <div className="caption">Footer</div>
                        <div className="inline-inputs">
                            <input type="text" name="icon_url" value={embed.footer.icon_url} className="field-input" onChange={updateFooter}/>
                            <input type="text" name="text" value={embed.footer.text} className="field-input" onChange={updateFooter}/>
                        </div>
                    </div>

                    <div className="form-item">
                        <div className="form-buttons" id="82183198237">
                            <button className="btn btn-add" onClick={addField}>Add Field</button>
                            <button className="btn btn-send" onClick={sendHook}>Send</button>
                        </div>
                    </div>
                </div>
                <div className="form-container-embed">
                    <div className="form-item">
                        <div className="caption">Preview</div>
                        <Embed {...embed} />
                    </div>
                </div>
            </div>
    )
}

export default Form;