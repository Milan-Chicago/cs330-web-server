
let activePost;
let activeComment;
let temp;
// gets post from the server:
const getPost = () => {
    // get post id from url address:
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);

    // fetch post:
    fetch('/api/posts/' + id + '/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            activePost = data;
            renderPost();
        });
};

const getComments = () => {
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);
    fetch('/api/comments/#' + id)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            activeComment = data;
            displayComments();
                });
};


// updates the post:
const updatePost = (ev) => {
    const data = {
        title: document.querySelector('#title').value,
        content: document.querySelector('#content').value,
        author: document.querySelector('#author').value
    };
    console.log(data);
    fetch('/api/posts/' + activePost.id + '/', { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            activePost = data;
            renderPost();
            showConfirmation();
        });
    
    // this line overrides the default form functionality:
    ev.preventDefault();
};

const addComment = (ev) => {
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);

    const data = {
        post_id: id,
        comment: document.querySelector('#comment').value,
        author: document.querySelector('#author').value
    };
    // console.log(data);
    fetch('/api/comments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(getComments())
        .then(showConfirmation);
};

const deletePost = (ev) => {
    const doIt = confirm('Are you sure you want to delete this blog post?');
    if (!doIt) {
        return;
    }
    fetch('/api/posts/' + activePost.id + '/', { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // navigate back to main page:
        window.location.href = '/';
    });
    ev.preventDefault()
};


const deleteComments = (c_id) => {
    const doIt = confirm('Are you sure you want to delete this comment?');
    if (!doIt) {
        return;
    }
    fetch('/api/comments/' + c_id + '/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        getComments();
    });
};

// creates the HTML to display the post:
const renderPost = (ev) => {
    const paragraphs = '<p>' + activePost.content.split('\n').join('</p><p>') + '</p>';
    const template = `
        <p id="confirmation" class="hide"></p>
        <h1>${activePost.title}</h1>
        <div class="date">${formatDate(activePost.published)}</div>
        <div class="content">${paragraphs}</div>
        <p>
            <strong>Author: </strong>${activePost.author}
        </p>
    `;
    document.querySelector('.post').innerHTML = template;
    toggleVisibility('view');

    // prevent built-in form submission:
    if (ev) { ev.preventDefault(); }
};

const displayComments = () => {
    let theHTML = '';
    comments_list = activeComment.map((comment) => {
        const sentences = '<p>' + comment.comment.split('\n').join('</p><p>') + '</p>';
        theHTML = `
        <div>${sentences}</div>
        <div>
            <strong>Author: </strong>${comment.author}
            <i class="btn fas fa-trash-alt" style="float: right;" onClick="deleteComments('${comment.id}');"></i>
        </div>
        `;
        return theHTML
    });

    document.querySelector('.comments').innerHTML = comments_list.join('\n');

};

// creates the HTML to display the editable form:
const renderForm = () => {
    const htmlSnippet = `
        <div class="input-section">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" value="${activePost.title}">
        </div>
        <div class="input-section">
            <label for="author">Author</label>
            <input type="text" name="author" id="author" value="${activePost.author}">
        </div>
        <div class="input-section">
            <label for="content">Content</label>
            <textarea name="content" id="content">${activePost.content}</textarea>
        </div>
        <button class="btn btn-main" id="save" type="submit">Save</button>
        <button class="btn" id="cancel" type="submit">Cancel</button>
    `;

    // after you've updated the DOM, add the event handlers:
    document.querySelector('#post-form').innerHTML = htmlSnippet;
    document.querySelector('#save').onclick = updatePost;
    document.querySelector('#cancel').onclick = renderPost;
    toggleVisibility('edit');
};

// Form where users can write comments and submit
const renderCommentForm = () => {
    const htmlSnippet = `
        <div class="input-section">
            <label for="author">Author</label>
            <input type="text" name="author" id="author" value="Milan">
        </div>
        <div class="input-section">
            <label for="content">Content</label>
            <textarea name="comment" id="comment"></textarea>
        </div>
        <button class="btn btn-main" id="save-comment" type="submit">Save</button>
        <button class="btn" id="cancel-comment" type="submit">Cancel</button>
    `;

    // after you've updated the DOM, add the event handlers:
    document.querySelector('#comments-form').innerHTML = htmlSnippet;
    document.querySelector('#save-comment').onclick = addComment;
    document.querySelector('#cancel-comment').onclick = getComments;
    console.log("HI");
    toggleVisibility('edit-comments');
};

const formatDate = (date) => {
    const options = { 
        weekday: 'long', year: 'numeric', 
        month: 'long', day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options); 
};

// handles what is visible and what is invisible on the page:
const toggleVisibility = (mode) => {
    if (mode === 'view') {
        document.querySelector('#view-post').classList.remove('hide');
        document.querySelector('#menu').classList.remove('hide');
        document.querySelector('#post-form').classList.add('hide');
        document.querySelector('#comments-form').classList.add('hide');
    } else if (mode === "edit-comments") {
        document.querySelector('#comments-form').classList.remove('hide');
    } else {
        document.querySelector('#view-post').classList.add('hide');
        document.querySelector('#menu').classList.add('hide');
        document.querySelector('#post-form').classList.remove('hide');
        // document.querySelector('#comments-form').classList.add('hide');
    }
};

const showConfirmation = () => {
    document.querySelector('#confirmation').classList.remove('hide');
    document.querySelector('#confirmation').innerHTML = 'Post successfully saved.';
};

// called when the page loads:
const initializePage = () => {
    // get the post from the server:
    getPost();
    getComments();
    // add button event handler (right-hand corner:
    document.querySelector('#edit-button').onclick = renderForm;
    document.querySelector('#delete-button').onclick = deletePost;
    document.querySelector('#add-comment-button').onclick = renderCommentForm;

};

initializePage();
