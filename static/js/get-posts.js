
// quering the posts (postman)  //
const getPosts = () => {
    // alert('fetching request from the API Endpoint');
    fetch('/api/posts')
        .then(response => {
            // alert('Got the request back. Now loading the request body.');
            return response.json();
        })
        .then(displayPosts);  // callback function //
};

const toHTMLElement = (post) => {
    // formatting the date:
    const options = { 
        weekday: 'long', year: 'numeric', 
        month: 'long', day: 'numeric' 
    };
    const dateFormatted = new Date(post.published).toLocaleDateString('en-US', options);
    const snippetLength = 100;
    const snippet = post.content.length > snippetLength ? post.content.substring(0, snippetLength) + '...' : post.content;
    
    return `
        <section class="post">
            <a class="detail-link" href="/post/#${post.id}">
                <h2>${post.title}</h2>
            </a>
            <div class="date">${dateFormatted}</div>
            <p>${snippet}</p>
            <p>
                <strong>Author: </strong>${post.author}
            </p>
        </section>
    `;
};

// function - looping through each post creating an html of each post //

const displayPosts = (data) => {
    console.log(data);
    // alert('Now I\'m building the HTML representation of the data.')
    const entries = [];
    for (const post of data) {
        entries.push(toHTMLElement(post));
    }
    // going to find the document - injection//
    console.log(entries);
    document.querySelector('#posts').innerHTML = entries.join('\n');
};

// starts the process to fire away to get the posts //
getPosts();