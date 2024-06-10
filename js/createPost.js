$(document).ready(function() {
    document.getElementById('create-post').addEventListener('click', () => {
    var fileInput = document.getElementById('postImage');
    var formData = new FormData();
    formData.append('id', id);
    formData.append('caption', document.getElementById('get-text').value);

    if (fileInput.files[0]) {
        formData.append('imagePost', fileInput.files[0]);
    } else {
        formData.append('imagePost', " ");
    }

    // Send the AJAX request to post.php to create the post
    $.ajax({
        url: "php/post.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            let result = JSON.parse(data);
            if (result.res === "success") {
                alert("Post added successfully.");
                window.location.reload();
            } else {
                alert(result.message);
            }
        },
        error: function() {
            alert("Error adding post.");
        }
    });
    })

    $(document).on('click', '#post-edit', function() {
var postId = $(this).closest('.post-container').find('#postId').val();
var userId = $(this).closest('.post-container').find('#userId').val();
var caption = $(this).closest('.post-container').find('.display-caption').text();
// var imageSrc = $(this).closest('.post-container').find('.post-image').css('background-image');

// Store data in localStorage to access it in the edit form
localStorage.setItem('editPostId', postId);
localStorage.setItem('editUserId', userId);
localStorage.setItem('editCaption', caption);
// localStorage.setItem('editImageSrc', imageSrc);

// Open the edit form in another file
window.location.href = 'editPost.html';
});


document.getElementById('see-profile').addEventListener('click', () => {
    window.location.href = 'profile.html';
})


var id = localStorage.getItem("id");
var name = localStorage.getItem("name");
var username = localStorage.getItem('username');
var image = localStorage.getItem('image');
if (!name) {    
    window.location.href = "index.html"; 
} else {
    var firstName = name.split(" ").slice(0, -1).join(" ");
    document.getElementById("fullname").textContent = name;
    document.getElementById("anotherName").textContent = firstName;
    document.getElementById("profile-image").src = "php/" + image;
    document.getElementById("name-avatar").src = "php/" + image;
    document.getElementById("poster-image").src = "php/" + image;
}
});