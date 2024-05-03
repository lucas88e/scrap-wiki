const axios = require("axios");
const express = require("express");
const app = express()
const cherrio = require("cheerio")
const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const endpoint = "https://es.wikipedia.org/"
app.get("/", (req, res) => {
    axios.get(url).then((response) => {
        if (response.status === 200) {
            const html = response.data
            const $ = cherrio.load(html)
            const nombres = []
            const links = []
           const objeto=[]

            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr("href")
                links.push(link);
                const promises=links.map(link=>axios.get(endpoint+link)) // Promesa porque si no no cargaban todos los datos del array
                Promise.all(promises).then((responses) => {
                        const objeto = responses.map(response =>{
                            const linkHtml = response.data;
                            const link$ = cherrio.load(linkHtml);
                            const titulo=link$("h1").text()
                            const imgs =link$("img").attr("src")
                            const parrafo = link$("p").text()
                             return{
                                titulo: titulo,
                                imagenes:imgs,
                                parrafo:parrafo
                             }
                        })
                        
                     
                        if(objeto.length===$('#mw-pages a').length){ // compara la longitud del objeto con los enlaces para que aparezcan por separado
                            console.log(objeto)
                            res.json(objeto)
                        }
                       
                    
                })
                
            }
            )

            $('#mw-pages a').each((index, element) => {
                const nombre = $(element).attr("title")
                nombres.push(nombre)
            })
            
     

        }

    })

})
app.get("/raperos",(req,res)=>{
    axios.get(url).then((response) => {
        if (response.status === 200) {
            const html = response.data
            const $ = cherrio.load(html)
            const title = $("h1").text()
          
            const nombres = []
            const imgsLink = []
            const links = []
            const titulos = []
            const parrafos = []

            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr("href")
                links.push(link);
                axios.get(endpoint + link).then((response) => {
                    if (response.status === 200) {
                        const linkHtml = response.data;
                        const link$ = cherrio.load(linkHtml);
                        const titulo=link$("h1").text()
                        titulos.push(titulo);
                        const imgs =link$("img").attr("src")
                        imgsLink.push(imgs)
                        const parrafo = link$("p").text()
                        parrafos.push(parrafo)
                        titulos.push(titulo)
                       
                        res.send(`<h1>RaperoS ${title}</h1><h2>Links</h2>${links.map((raperos, index) => //RECORRE LOS NOMBRES y ASIGNA UN INDICE A CADA LINK
                        `<ul><li><a href=${endpoint}${raperos}>${nombres[index]}</a></li></ul>`).join("")} `)
                    }
                })
                
            }
            )

            $('#mw-pages a').each((index, element) => {
                const nombre = $(element).attr("title")
                nombres.push(nombre)
            })
    

        }
    
    

})})
app.listen(3000, () => {
    console.log("El servidor se ejecuta en el http://localhost:3000")
})