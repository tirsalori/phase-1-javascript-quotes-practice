document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then((response) => response.json())
        .then((data) => data.forEach(quoteObj => populateQuotes(quoteObj)))
    const sortBtn = document.createElement("button")
    const div = document.querySelector("h1").nextElementSibling
    const ul = document.getElementById("quote-list")
    sortBtn.innerText = "SORT OFF"
    div.insertBefore(sortBtn, ul)
    sortBtn.addEventListener("click", (e) => {
        document.getElementById("quote-list").innerHTML = ""
        if (sortBtn.innerText === "SORT OFF"){
            sortBtn.innerText = "SORT ON"
            fetch('http://localhost:3000/quotes?_embed=likes&_sort=author')
                .then((response) => response.json())
                .then((data) => data.forEach(quoteObj => populateQuotes(quoteObj)))
        } else {
            sortBtn.innerText = "SORT OFF"
            fetch('http://localhost:3000/quotes?_embed=likes')
                .then((response) => response.json())
                .then((data) => data.forEach(quoteObj => populateQuotes(quoteObj)))
        }  
    })
})

function populateQuotes (quoteObj) {
    const ul = document.getElementById("quote-list")
    const li = document.createElement("li")
    const blockQuote = document.createElement("blockquote")
    const p = document.createElement("p")
    const footer = document.createElement("footer")
    const successBtn = document.createElement("button")
    const dangerBtn = document.createElement("button")
    const editBtn = document.createElement("button")
    const editForm = document.createElement("form")
    const editSubmitBtn = document.createElement("button")
    const input = document.createElement("input")
    const span = document.createElement("span")
    const br = document.createElement("br")
    li.setAttribute("class", "quote-card")
    blockQuote.setAttribute("class", "blockquote")
    p.setAttribute("class", "mb-0")
    footer.setAttribute("class", "blockquote-footer")
    successBtn.setAttribute("class", "btn-success")
    dangerBtn.setAttribute("class", "btn-danger")
    input.setAttribute("name", "edit-quote")
    input.setAttribute("placeholder", quoteObj.quote)
    p.innerText = quoteObj.quote
    footer.innerText = quoteObj.author
    successBtn.innerText = "Likes: "
    span.innerText = quoteObj.likes.length
    dangerBtn.innerText = "Delete"
    editBtn.innerText = "Edit"
    editSubmitBtn.innerText = "Submit"
    editForm.style.display = "none"
    successBtn.appendChild(span)
    editForm.append(input, editSubmitBtn)
    blockQuote.append(p, footer, br, successBtn, editBtn, dangerBtn, editForm)
    li.appendChild(blockQuote)
    ul.appendChild(li)
    successBtn.addEventListener("click", () => {
        document.getElementById("quote-list").innerHTML = ""
        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                "quoteId": quoteObj.id
        })
    })
            .then((resp) => {
                if (resp.status === 201) {
                    fetch("http://localhost:3000/quotes?_embed=likes")
                        .then((r) => r.json())
                        .then((d) => d.forEach(quoteObj => populateQuotes(quoteObj)))
                }
            })
    }) 
    dangerBtn.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: "DELETE"
        })
        li.remove()
    })
    editBtn.addEventListener("click", () => {
        if (editForm.style.display === "none") {
            editForm.style.display = ""
        } else {
            editForm.style.display = "none"
        }
    })
    editForm.addEventListener("submit", (e) => {
        document.getElementById("quote-list").innerHTML = ""
        e.preventDefault()
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                "quote": e.target[0].value
            })
        })   
        .then((resp) => {
            if (resp.status === 200) {
                fetch("http://localhost:3000/quotes?_embed=likes")
                    .then((r) => r.json())
                    .then((d) => d.forEach(quoteObj => populateQuotes(quoteObj)))
            }
        })
    })
}

const form = document.getElementById("new-quote-form")
form.addEventListener("submit", e => {
    e.preventDefault()
    document.getElementById("quote-list").innerHTML = ""
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            "quote": e.target[0].value,
            "author": e.target[1].value
        })
    })   
        .then((resp) => {
            if (resp.status === 201) {
                fetch("http://localhost:3000/quotes?_embed=likes")
                    .then((r) => r.json())
                    .then((d) => d.forEach(quoteObj => populateQuotes(quoteObj)))
            }
        })
})

