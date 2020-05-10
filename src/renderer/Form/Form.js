import React, { useState, useEffect } from 'react'
import '../styles/Form.scss';
import Embed from '../Embed/embed.js' ;
import { ipcRenderer } from 'electron';
import { cloneDeep } from 'lodash';
const axios = require('axios');

const Form = () => {
    const [ embed, setEmbed ] = useState({"title":"Ballpark™ Poncho","url":"https://www.supremecommunity.com/season/spring-summer2020/droplist/2020-04-30/","description":"Polyethylene rain poncho with adjustable hood and printed logo on chest.","fields":[{"name":"Category","value":"Accessories","inline":false, id: 128319837},{"name":"Price","value":"£3 / $4","inline":false, id:12938193},{"name":"Upvotes / Downvotes","value":"15215 / 671","inline":false, id:123718327}],color: "#2cb67d", "footer":{"text":"Powered by OnDemand • @AIOMonito","icon_url":"https://www.shihab.dev/ondemand.png"}, "thumbnail":{"url":"https://www.supremecommunity.com/u/season/spring-summer2020/accessories/01e6c4d7ac6047a9aeaa44078685d235_sqr.jpg", enabled: true}, "image":{"url":"https://www.supremecommunity.com/u/season/spring-summer2020/accessories/01e6c4d7ac6047a9aeaa44078685d235_sqr.jpg", enabled: false}});
    const [ webhook, setWebhook ] = useState("");

    useEffect(() => {
        ipcRenderer.on('title', (evt, arg) => {
            setEmbed(prevInfo => ({
                ...prevInfo,
                title: arg
            }))
        })
    })

    const updateEmbed = (e) => {
        let { name, value } = e.target; 
        switch(name) {
            case 'thumbnail':
                setEmbed(prevInfo => ({
                    ...prevInfo,
                    thumbnail: {
                        ...prevInfo.thumbnail,
                        url: value
                    }
                }));
                break;
            case 'image':
                setEmbed(prevInfo => ({
                    ...prevInfo,
                    image: {
                        ...prevInfo.image,
                        url: value
                    }
                }));
                break;
            default:
                let data = {};
                data[name] = value;
                setEmbed(prevInfo => ({
                    ...prevInfo,
                    ...data
                }))
        }
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
        let updated = embed.fields.filter(field => field.id == id)[0];
        updated[e.target.name] = e.target.value;
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: oldEmbed.fields.map(field => field.id == id ? updated : field)
        }))
    }

    const toggleInline = (e) => {
        const id = e.currentTarget.parentNode.parentNode.id;
        let updated = embed.fields.filter(field => { return field.id == id})[0];
        updated.inline = !updated.inline;
        setEmbed(oldEmbed => ({
            ...oldEmbed,
            fields: oldEmbed.fields.map(field => field.id == id ? updated : field)
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
            fields: oldEmbed.fields.filter(field => field.id != id )
        }));
    }
    //https://discordapp.com/api/webhooks/708525942771023873/XOAraNyOxbLyITBrTwwPToPRJv2it7YYllbBm93TxOc6UvOJdfoD_oNK96cRnnwZvvCW
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

    const toggleImage = (e) => {
        switch (e.target.id) {
            case 'thumbnail-toggle': 
                setEmbed(oldEmbed => ({
                    ...oldEmbed,
                    thumbnail: {
                        url: oldEmbed.thumbnail.url,
                        enabled: !oldEmbed.thumbnail.enabled
                    },
                }))
                break;
            case 'image-toggle':
                setEmbed(oldEmbed => ({
                    ...oldEmbed,
                    image: {
                        url: oldEmbed.image.url,
                        enabled: !oldEmbed.image.enabled
                    }
                }));
                break;
        }
    }


    const sendHook = async () => {
        try {
            let newEmbed = cloneDeep(embed);
            newEmbed.color = newEmbed.color ? parseInt(`0x${newEmbed.color.replace("#", "")}`) : null;
            newEmbed.thumbnail.url = newEmbed.thumbnail.enabled ? newEmbed.thumbnail.url : "";
            newEmbed.image.url = newEmbed.image.enabled ? newEmbed.image.url : "";
            await axios.post(webhook, {
                content : null,
                embeds : [emb]
            });
            return;
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container" data-aos="fade-in" data-aos-duration="1500">
                <div className="form">
                    <div className="form-item">
                        <div className="label">Webhook</div>
                        <input name="webhook" type="text" className="regular-input" placeholder="https://discordapp.com/api/webhooks" value={webhook} onChange={e => {setWebhook(e.target.value)}}/>
                    </div>
                    <div className="form-item">
                        <div className="caption">Title</div>
                        <input name="title" type="text" className="regular-input" value={embed.title} onChange={updateEmbed} />
                    </div>
                    <div className="form-item">
                        <div className="caption">Description</div>
                        <textarea name="description" onInput={updateEmbed} onPropertyChange={updateEmbed} value={embed.description} maxLength="2048"/>
                    </div>
                    <div className="form-item">
                        <div className="caption">URL</div>
                        <input name="url" className="regular-input" onInput={updateEmbed} onChange={updateEmbed} value={embed.url} />
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
                                            <input type="checkbox" id={`toggle-${field.id}`} class="offscreen" onChange={toggleInline}/> <label for={`toggle-${field.id}`} class="switch"></label>
                                            <button type="button" className="field-btn btn-danger" onClick={removeField}>-</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="form-item">
                        <div className="caption">Thumbnail</div>
                        <div className={`image-input-container ${!embed.thumbnail.enabled  ? 'off' : ''}`}>
                            <input type="text" name="thumbnail" value={embed.thumbnail.url} className="field-input" onChange={updateEmbed} disabled={!embed.thumbnail.enabled} />
                            <input type="checkbox" id="thumbnail-toggle" className="offscreen" onChange={toggleImage} checked={embed.thumbnail.enabled}/> <label for="thumbnail-toggle" class="switch"></label>
                        </div>
                    </div>

                    <div className="form-item">
                        <div className="caption">Image</div>
                        <div className={`image-input-container ${!embed.image.enabled  ? 'off' : ''}`}>
                            <input type="text" name="image" value={embed.image.url} className="image-input" onChange={updateEmbed} disabled={!embed.image.enabled} />
                            <input type="checkbox" id="image-toggle" className="offscreen" onChange={toggleImage} checked={embed.image.enabled}/> <label for="image-toggle" class="switch"></label>
                        </div>
                    </div>
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
                        <Embed {...embed} image={embed.image.enabled ? embed.image : null} thumbnail={embed.thumbnail.enabled ? embed.thumbnail : null}/>
                        {
                            Object.keys(embed).includes("thumbnail") && Object.keys(embed["thumbnail"]).includes("url") && embed.thumbnail.url.length > 0 &&
                            <div className="note" style={{maxWidth: "60%", fontSize: "10px", marginTop: "10px"}}>Note: Inline fields may not be rendered correctly with a thumbnail set. Please test your webhook to view actual results.</div>
                        }
                    </div>
                </div>
            </div>
    )
}

export default Form;