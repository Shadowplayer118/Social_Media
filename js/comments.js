$(document).ready(function() {
    let commentInput;

    $('.feeds-content').on('click', '#comment-btn', function() {
        commentInput = $(this).siblings('input[type="text"]');
        let commentText = commentInput.val().trim();
        let postId = $(this).closest('.post-container').find('#postId').val();
        let userId = localStorage.getItem("id");
        let friendId = $(this).closest('.post-container').find('#userId').val();

        if (commentText !== '') {
            addComment(userId, friendId, postId, commentText);
        }
    });

    // Function to add a comment
    function addComment(userId, friendId, postId, commentText) {
        $.ajax({
            url: "php/addComment.php",
            type: "POST",
            data: {
                user_id: userId,
                friend_id: friendId,
                postId: postId,
                comment: commentText
            },
            success: function(data) {
                let result = JSON.parse(data);
                if (result.res === "success") {
                    alert("Comment added successfully.");
                    // Clear the input field
                    commentInput.val('');
                } else {
                    alert(result.message);
                }
            },
            error: function() {
                alert("Error adding comment.");
            }
        });
    }
});


$(document).ready(function() {
    // Open comment modal and fetch comments
    $('.feeds-content').on('click', '.open-comment-modal', function() {
        let postId = $(this).closest('.post-container').find('#postId').val();
        fetchComments(postId);
        $('#commentModal').css('display', 'block');
    });

    // Close the comment modal when clicking on the close button
    $('.close').click(function() {
        $('#commentModal').css('display', 'none');
    });

    // Close the comment modal when clicking outside the modal
    $(window).click(function(event) {
        if (event.target.id === 'commentModal') {
            $('#commentModal').css('display', 'none');
        }
    });

    // Function to fetch comments for a post
function fetchComments(postId) {
    $.ajax({
        url: "php/fetchComments.php",
        type: "POST",
        data: { postId: postId },
        success: function(data) {
            let comments = JSON.parse(data);
            let commentsContainer = $('#commentModal .comments-container');
            commentsContainer.empty();

            let userId = localStorage.getItem("id");

            comments.forEach(comment => {
                let commentDiv = document.createElement('div');
                commentDiv.classList.add("comment-container");
                let commentText = document.createElement('p');
                commentDiv.innerHTML = `<strong>${comment.userName}</strong>: ${comment.comment}`;
                commentDiv.appendChild(commentText);

                if (comment.user_id == userId) { // Use '==' for loose comparison
                    let editBtn = document.createElement('button');
                    editBtn.classList.add("comment-edit");
                    editBtn.textContent = 'Edit';
                    editBtn.addEventListener('click', function() {
                        // Create a textarea for editing
                        let editTextarea = document.createElement('textarea');
                        editTextarea.value = comment.comment;
                        commentDiv.replaceChild(editTextarea, commentText);

                        // Create a submit button
                        let submitBtn = document.createElement('button');
                        submitBtn.textContent = 'Submit';
                        submitBtn.addEventListener('click', function() {
                            let updatedComment = editTextarea.value;
                            updateComment(comment.id, updatedComment);
                        });
                        commentDiv.appendChild(submitBtn);

                        // Remove the edit button
                        commentDiv.removeChild(editBtn);
                    });
                    commentDiv.appendChild(editBtn);

                    let deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.addEventListener('click', function() {
                        // Handle delete comment
                        deleteComment(comment.id);
                    });
                    commentDiv.appendChild(deleteBtn);
                }

                commentsContainer.append(commentDiv);
            });
        },
        error: function() {
            alert("Error fetching comments.");
        }
    });
}

    // Function to delete a comment
    function deleteComment(commentId) {
        $.ajax({
            url: "php/deleteComment.php",
            type: "POST",
            data: { commentId: commentId },
            success: function(data) {
                alert("Comment deleted successfully.");
                window.location.reload();
            },
            error: function() {
                alert("Error deleting comment.");
            }
        });
    }

    function updateComment(commentId, updatedComment) {
    $.ajax({
        url: "php/updateComment.php",
        type: "POST",
        data: {
            commentId: commentId,
            updatedComment: updatedComment
        },
        success: function(data) {
            alert("Comment updated successfully.");
            $('#editCommentModal').css('display', 'none');
            window.location.reload();
        },
        error: function() {
            alert("Error updating comment.");
        }
    });
}



});